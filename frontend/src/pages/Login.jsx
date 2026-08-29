import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';
import Icon from '../components/Icon';
import { startGoogleAuth } from '../services/googleAuthService';
import '../styles/auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  // Handle redirect back from Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get('oauth_success');
    const token = params.get('token');

    if (oauthSuccess === 'true' && token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);

      // Fetch the real MongoDB user, then go to dashboard
      refreshUser().finally(() => navigate('/dashboard'));
    }
  }, [refreshUser, navigate]);

  // Google login
  const handleGoogleLogin = () => {
    const redirected = startGoogleAuth('login');

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
            <h1 className="auth-heading">Welcome back</h1>
            <p className="auth-subtext">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="auth-subtext-link">
                Sign up
              </Link>
            </p>
          </div>

          {authError && (
            <div className="auth-error-banner" role="alert">
              {authError}
            </div>
          )}

          {/* Google OAuth */}
          <GoogleAuthButton label="Continue with Google" onClick={handleGoogleLogin} />

          <div className="auth-or-divider">OR</div>

          {/* Email/password (connected to backend later) */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setAuthError('Email/password login is not enabled yet. Please use Google.');
            }}
          >
            <div className="auth-form-fields">
              <div className="field-group">
                <label className="field-label" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  className="field-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  className="field-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-primary-btn">
              Log in
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
