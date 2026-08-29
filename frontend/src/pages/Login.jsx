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

  // Handle redirect back from Google OAuth — backend sends ?oauth_success=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');

    // Helper to get cookie value by name
    const getCookie = (cname) => {
      const name = cname + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return '';
    };

    // Debug logging to see exactly what parameters/cookies the backend redirects with
    if (window.location.search) {
      localStorage.setItem('meditrack_oauth_debug', window.location.search);
    }
    if (document.cookie) {
      localStorage.setItem('meditrack_cookies_debug', document.cookie);
    }

    if (oauthSuccess === 'true') {
      // 1. Try to parse a full serialized user object if the backend sent one in query parameters
      let parsedUser = null;
      const userParam = params.get('user');
      if (userParam) {
        try {
          parsedUser = JSON.parse(decodeURIComponent(userParam));
        } catch (e) {
          console.error('Error parsing user query param JSON:', e);
        }
      }

      // 2. Try to parse user from cookies
      let cookieUser = null;
      const userCookie = getCookie('user') || getCookie('meditrack_user');
      if (userCookie) {
        try {
          cookieUser = JSON.parse(userCookie);
        } catch (e) {
          console.error('Error parsing user cookie JSON:', e);
        }
      }

      // 3. Fallback to individual parameters
      const rawName = params.get('name') || params.get('displayName') || parsedUser?.name || cookieUser?.name || getCookie('name') || '';
      const rawEmail = params.get('email') || parsedUser?.email || cookieUser?.email || getCookie('email') || '';
      const rawAvatar = params.get('profileImage') || params.get('avatar') || params.get('picture') || parsedUser?.profileImage || parsedUser?.avatar || cookieUser?.profileImage || cookieUser?.avatar || getCookie('avatar') || getCookie('profileImage') || '';

      const name = rawName ? decodeURIComponent(rawName) : '';
      const email = rawEmail ? decodeURIComponent(rawEmail) : '';
      const avatar = rawAvatar ? decodeURIComponent(rawAvatar) : '';

      const userObj = {
        name: name || 'Google User',
        greeting: name ? name.split(' ')[0] : 'User',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        email: email || '',
      };

      login(userObj);
      navigate('/dashboard', { replace: true });
    } else if (oauthError) {
      console.error('OAuth error:', oauthError);
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
