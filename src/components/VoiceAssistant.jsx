import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from './Toast';

const VoiceAssistant = ({ onCommand, extraContext = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const processCommandRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    processCommandRef.current = processCommand;
  });

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
          } else {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error !== 'aborted') {
            addToast(`Microphone error: ${event.error}`, 'error');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // If we have a transcript when listening stops, process it!
        if (recognitionRef.current && recognitionRef.current.finalTranscript && recognitionRef.current.finalTranscript.trim() !== '') {
             if (processCommandRef.current) {
                 processCommandRef.current(recognitionRef.current.finalTranscript);
             }
             recognitionRef.current.finalTranscript = ''; // Clear to prevent double processing
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        try {
            recognitionRef.current.stop();
        } catch(e) {}
      }
    };
  }, []);

  // Use an effect to track the latest transcript for the onend handler
  useEffect(() => {
    if (recognitionRef.current) {
        recognitionRef.current.finalTranscript = transcript;
    }
  }, [transcript]);

  // Continuous listening loop
  useEffect(() => {
    let timer;
    if (isActive && !isListening && !isProcessing && recognitionRef.current) {
      timer = setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (e) {
             // Ignore if already started
        }
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [isActive, isListening, isProcessing]);

  const processCommand = async (commandText) => {
    if (!commandText.trim()) return;
    
    setIsProcessing(true);
    addToast(`Processing command: "${commandText}"`, 'info');

    try {
      const response = await fetch('/api/parse-voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandText, context: extraContext })
      });

      const data = await response.json();
      
      if (data.success && data.intent) {
        onCommand(data.intent);
      } else {
        addToast("Sorry, I didn't understand that command.", 'warning');
      }
    } catch (error) {
      console.error("Failed to parse voice command:", error);
      addToast("Failed to process voice command. Please try again.", 'error');
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      addToast("Your browser does not support voice recognition.", 'error');
      return;
    }

    if (isActive) {
      setIsActive(false);
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      addToast("Voice Assistant paused.", 'info');
    } else {
      setIsActive(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
      addToast("Voice Assistant actively listening.", 'success');
    }
  };

  // Do not render if API is not supported
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexDirection: 'row-reverse'
    }}>
      
      {/* Transcript Tooltip */}
      {(isListening || isProcessing) && (
        <div style={{
          background: 'var(--color-glass-surface)',
          border: '1px solid var(--color-glass-border)',
          backdropFilter: 'blur(12px)',
          padding: '12px 16px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          color: 'var(--color-dark-charcoal)',
          maxWidth: '300px',
          fontSize: '0.95rem',
          animation: 'fadeIn 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
           {isProcessing ? (
               <>
                 <Loader2 size={16} className="spin text-accent" />
                 <span style={{ fontStyle: 'italic' }}>Analyzing intent...</span>
               </>
           ) : (
               <span>{transcript || "Listening..."}</span>
           )}
        </div>
      )}

      {/* Mic Button */}
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: isActive ? '#e74c3c' : 'var(--color-glass-surface)',
          color: isActive ? 'white' : 'var(--color-dark-charcoal)',
          boxShadow: isActive ? '0 0 20px rgba(231, 76, 60, 0.6)' : 'var(--shadow-md)',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
          border: isActive ? 'none' : '1px solid var(--color-glass-border)'
        }}
        title={isActive ? "Turn Off Voice Assistant" : "Turn On Voice Assistant"}
        onMouseEnter={(e) => {
           if (!isActive && !isProcessing) e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
           if (!isActive && !isProcessing) e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isActive ? (
          <div style={{ animation: isListening ? 'pulse 1.5s infinite' : 'none' }}>
            <Mic size={24} style={{ color: 'white' }} />
          </div>
        ) : (
          <MicOff size={24} style={{ color: "#e67e22" }} />
        )}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default VoiceAssistant;
