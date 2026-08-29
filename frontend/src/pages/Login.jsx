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
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth_success') === 'true') {
      login();
      navigate('/dashboard');
    }
  }, [login, navigate]);

  const handleSubmit = (event) => {
    event?.preventDefault?.();
    login();
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    const redirected = startGoogleAuth('login');

    if (!redirected) {
      login({ provider: 'google' });
      navigate('/dashboard');
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

          <GoogleAuthButton label="Continue with Google" onClick={handleGoogleLogin} />

          <div className="auth-or-divider">OR</div>

          <form onSubmit={handleSubmit}>
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

          <button type="button" className="demo-login-btn" onClick={handleSubmit}>
            Demo: 1-Click Quick Login
          </button>
        </div>
      </main>
    </div>
  );
}

export default Login;
