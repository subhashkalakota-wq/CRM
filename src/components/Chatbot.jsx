import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, Maximize2, Minimize2, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import './Chatbot.css';

const Chatbot = ({ customer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Aura Assistant. Need clarification on the product interest?" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // default explicitly speaks
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef('');

  // Sync state with ref for the onend callback
  useEffect(() => {
    inputRef.current = inputVal;
  }, [inputVal]);

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
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputVal(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically send the message if we transcribed something
        if (inputRef.current && inputRef.current.trim() !== '') {
          // Trigger the form submission
          handleSendFromVoice(inputRef.current);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    }
  }, []);

  // Listen for external forceful toggle requests (e.g. from VoiceAssistant)
  useEffect(() => {
    const handleToggle = (e) => {
      const command = e.detail;
      if (command === 'open') {
        setIsOpen(true);
      } else if (command === 'close') {
        setIsOpen(false);
      } else {
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('toggle-chatbot', handleToggle);
    return () => window.removeEventListener('toggle-chatbot', handleToggle);
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis?.cancel(); // stop talking if we start listening
      setInputVal(''); // clear input for fresh dictation
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }
  };

  const speakResponse = (text) => {
    if (isMuted) return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any currently playing audio
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Aggressive fallback to find a female English voice across macOS, Windows, iOS, Android, and ChromeOS
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      // Common keywords indicating female voices
      v.name.includes('Female') || 
      v.name.includes('Woman') ||
      v.name.includes('Girl') ||
      // macOS / iOS specific names
      v.name.includes('Samantha') || 
      v.name.includes('Victoria') ||
      v.name.includes('Karen') ||
      v.name.includes('Tessa') ||
      v.name.includes('Moira') ||
      v.name.includes('Veena') ||
      v.name.includes('Fiona') ||
      // Windows specific names
      v.name.includes('Zira') ||
      v.name.includes('Hazel') ||
      // Google / Android voices (Google US English defaults to female, Google UK English Female exists)
      (v.lang.startsWith('en-') && !v.name.includes('Male') && (v.name.includes('Google') || v.name.includes('Microsoft')))
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else {
      // Final fallback: just try to grab any English voice out there just in case the OS lists them generically
      const englishVoice = voices.find(v => v.lang.startsWith('en-'));
      if (englishVoice) utterance.voice = englishVoice;
    }
    
    // Slight pitch modification to sound more pleasant if relying on fallback
    utterance.pitch = 1.1;
    
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    if (!isMuted) {
       window.speechSynthesis?.cancel(); // stop immediately if muting
    }
    setIsMuted(!isMuted);
  };

  const openChat = () => {
    setIsOpen(true);
    // Optionally speak the greeting if we just opened it
    if (messages.length === 1 && !isMuted) {
      speakResponse(messages[0].text);
    }
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat if customer changes substantially (optional)
  useEffect(() => {
    if (customer && !isOpen) {
      setMessages([
        { role: 'assistant', text: `Hi! I see you are looking at ${customer.name}. Do you have questions about their interest in ${customer.productInterest}?` }
      ]);
    }
  }, [customer]);

  const handleSendFromVoice = async (text) => {
    if (!text.trim()) return;
    const userMessage = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputVal('');
    setIsLoading(true);

    await processMessage(userMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = inputVal.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputVal('');
    setIsLoading(true);

    await processMessage(userMessage);
  };

  const processMessage = async (userMessage) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          context: customer ? `Customer: ${customer.name}, Product Interest: ${customer.productInterest}` : 'No specific customer selected.'
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
        speakResponse(data.reply);
      } else {
        const errMsg = "Sorry, I encountered an error answering your question.";
        setMessages(prev => [...prev, { role: 'assistant', text: errMsg }]);
        speakResponse(errMsg);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Network error connecting to the AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="chatbot-toggle-btn shadow-xl" onClick={openChat}>
          <MessageSquare size={24} color="#0dd3ff" />
        </button>
      )}

      {isOpen && (
        <div className={`chatbot-window shadow-xl ${isFullScreen ? 'fullscreen' : ''}`}>
          <div className="chatbot-header">
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Bot size={20} className="text-accent" />
              <h3>Aura Assistant</h3>
            </div>
            <div style={{display: 'flex', gap: '8px'}}>
              <button className="chatbot-close-btn" onClick={toggleMute} title={isMuted ? "Unmute Assistant" : "Mute Assistant"}>
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button className="chatbot-close-btn" onClick={() => setIsFullScreen(!isFullScreen)} title="Toggle Fullscreen">
                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button className="chatbot-close-btn" onClick={() => { setIsOpen(false); window.speechSynthesis?.cancel(); }} title="Close Chat">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble assistant loading">
                <Loader2 size={16} className="spin text-accent" />
                <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <button 
              type="button" 
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Talk to AI"}
              style={{
                background: isListening ? '#e74c3c' : 'transparent',
                color: isListening ? 'white' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                animation: isListening ? 'pulse 1.5s infinite' : 'none'
              }}
            >
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <input 
              type="text" 
              placeholder={isListening ? "Listening..." : "Ask about the product..."} 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isLoading || isListening}
            />
            <button type="submit" disabled={!inputVal.trim() || isLoading} className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
