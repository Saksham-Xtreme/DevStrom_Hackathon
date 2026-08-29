import { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleAuthButton from '../components/GoogleAuthButton';
import Icon from '../components/Icon';
import { startGoogleAuth } from '../services/googleAuthService';
import '../styles/auth.css';

function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleNext = (event) => {
    event?.preventDefault?.();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleGoogleSignup = () => {
    const redirected = startGoogleAuth('signup');
    if (!redirected) {
      setAuthError('Unable to start Google sign-in. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <div className="auth-brand-badge">
          <Icon name="logo" />
        </div>
        <span className="auth-brand-name">MediTrack</span>
      </header>

      <main className="auth-main-wrap">
        <div className="auth-box">
          <div className="auth-header">
            <h1 className="auth-heading">Create an account</h1>
            <p className="auth-subtext">
              Already have an account?{' '}
              <Link to="/login" className="auth-subtext-link">
                Log in
              </Link>
            </p>
          </div>

          {authError && (
            <div className="auth-error-banner" role="alert">
              {authError}
            </div>
          )}

          <GoogleAuthButton label="Continue with Google" onClick={handleGoogleSignup} />

          <div className="auth-or-divider">OR</div>

          <div className="stepper-container">
            <div className="stepper-line">
              <div
                className="stepper-line-progress"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              />
            </div>

            <div className="stepper-step">
              <div className={`step-circle ${step === 1 ? 'step-circle--active' : step > 1 ? 'step-circle--completed' : ''}`}>
                {step > 1 ? 'OK' : '1'}
              </div>
              <span className={`step-label ${step === 1 ? 'step-label--active' : ''}`}>
                Enter your email address
              </span>
            </div>

            <div className="stepper-step">
              <div className={`step-circle ${step === 2 ? 'step-circle--active' : step > 2 ? 'step-circle--completed' : ''}`}>
                {step > 2 ? 'OK' : '2'}
              </div>
              <span className={`step-label ${step === 2 ? 'step-label--active' : ''}`}>
                Provide your basic info
              </span>
            </div>

            <div className="stepper-step">
              <div className={`step-circle ${step === 3 ? 'step-circle--active' : ''}`}>3</div>
              <span className={`step-label ${step === 3 ? 'step-label--active' : ''}`}>
                Create your password
              </span>
            </div>
          </div>

          <form onSubmit={handleNext}>
            <div className="auth-form-fields">
              {step === 1 && (
                <div className="field-group">
                  <label className="field-label" htmlFor="signup-email">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    className="field-input"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoFocus
                  />
                </div>
              )}

              {step === 2 && (
                <>
                  <div className="field-group">
                    <label className="field-label" htmlFor="signup-name">
                      Full Name
                    </label>
                    <input
                      id="signup-name"
                      className="field-input"
                      type="text"
                      placeholder="e.g. Ansh Kumar"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="signup-phone">
                      Phone Number
                    </label>
                    <input
                      id="signup-phone"
                      className="field-input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="field-group">
                  <label className="field-label" htmlFor="signup-password">
                    Create a password
                  </label>
                  <input
                    id="signup-password"
                    className="field-input"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoFocus
                  />
                </div>
              )}
            </div>

            <button type="submit" className="auth-primary-btn">
              {step === 3 ? 'Create Account' : 'Next'}
            </button>
          </form>

          <p className="auth-note">
            Account creation is completed via Google. Email/password sign-up is coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Signup;
