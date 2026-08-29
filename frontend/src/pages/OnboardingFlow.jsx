import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UploadPrescription from './UploadPrescription';

function OnboardingFlow() {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleFinishOnboarding = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={handleFinishOnboarding}
        >
          Skip onboarding for now →
        </button>
      </div>

      <UploadPrescription
        isOnboarding={true}
        onComplete={handleFinishOnboarding}
      />
    </div>
  );
}

export default OnboardingFlow;
