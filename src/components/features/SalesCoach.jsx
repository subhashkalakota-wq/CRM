import { Lightbulb, Target, ArrowRightCircle } from 'lucide-react';
import { useToast } from '../Toast';
import '../modules/Modules.css';

const SalesCoach = ({ customer }) => {
  const { addToast } = useToast();

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header">
        <div className="module-title-group">
          <div className="icon-wrapper gold">
            <Lightbulb size={24} />
          </div>
          <div>
            <h2>AI Sales Coach</h2>
            <p className="text-muted">Actionable tips and strategy improvements based on your recent performance.</p>
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="coach-wrapper glass-panel">
          <div className="coach-header">
            <div className="coach-avatar">
              <img src="https://ui-avatars.com/api/?name=Agentforce+Coach&background=D6AD60&color=fff" alt="AI Coach" />
            </div>
            <div>
              <h3>Weekly Performance Coaching</h3>
              <p className="text-muted">Analysis focuses on: {customer ? customer.name : 'General Client Interactions'}</p>
            </div>
          </div>

          <div className="coach-body">
            <div className="coach-section">
              <h4><ArrowRightCircle size={18} className="text-accent"/> Communication Analysis</h4>
              <p>In your last 3 discovery calls with <strong>{customer ? customer.contact : 'the client'}</strong>, your <strong>talk-to-listen ratio was {customer ? 50 + customer.id : 65}:{customer ? 50 - customer.id : 35}</strong>. Top performers aim for 45:55. Try asking more open-ended questions and pausing longer after the client speaks.</p>
            </div>

            <div className="coach-section">
              <h4><Target size={18} className="text-accent"/> Strategy Recommendation</h4>
              <p>You have 4 deals lingering in the "Negotiation" phase for over 14 days. The AI suggests leveraging the new ROI Calculator tool to finalize value justification.</p>
            </div>

            <div className="coach-action">
              <h4>Recommended Learning Module</h4>
              <button
                className="btn-primary flex-center w-full mt-2"
                onClick={() => addToast("Goal set! We will remind you during your next call.", "success")}
              >
                Set as Active Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesCoach;
