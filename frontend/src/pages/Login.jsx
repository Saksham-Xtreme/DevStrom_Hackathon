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

  // Handle redirect back from Google OAuth
  useEffect(() => {
    console.log('\n🔵 LOGIN PAGE OAuth effect started');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔎 Search:', window.location.search);

    const params = new URLSearchParams(window.location.search);

    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');
    const token = params.get('token');

    console.log('oauth_success:', oauthSuccess);
    console.log('oauth_error:', oauthError);
    console.log('token exists:', !!token);

    /*
     * Google OAuth succeeded.
     *
     * Backend should redirect to:
     *
     * /dashboard?oauth_success=true&token=JWT
     *
     * We only store the JWT here.
     * AuthContext is responsible for calling /api/auth/me
     * and fetching the actual MongoDB user.
     */
    if (oauthSuccess === 'true') {
      console.log('✅ OAuth success detected');

      if (token) {
        console.log('🔐 JWT received from backend');

        localStorage.setItem('token', token);

        console.log(
          '✅ JWT stored in localStorage:',
          !!localStorage.getItem('token')
        );

        // Remove token from the URL for security/cleanliness.
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        console.log('🧹 OAuth parameters removed from URL');
      } else {
        console.error(
          '❌ OAuth succeeded but backend did NOT return a token'
        );
      }

      /*
       * DO NOT create a user here.
       *
       * AuthContext will:
       *
       * token
       *   ↓
       * GET /api/auth/me
       *   ↓
       * MongoDB
       *   ↓
       * real user
       */
      console.log('➡️ AuthContext will fetch the current user');
    } else if (oauthError) {
      console.error('❌ Google OAuth error:', oauthError);
      console.error(
        '❌ Full OAuth query:',
        window.location.search
      );
    } else {
      console.log('ℹ️ No OAuth callback parameters');
    }
  }, []);

  // Normal email/password login
  const handleSubmit = (event) => {
    event?.preventDefault?.();

    console.log('🟡 Email/password login submitted');
    console.log('📧 Email:', email);

    /*
     * This is still demo/local login for now.
     *
     * We will connect this to:
     * POST /api/auth/login
     *
     * after Google authentication is working.
     */
    login();

    navigate('/dashboard');
  };

  // Google login
  const handleGoogleLogin = () => {
    console.log('\n🟢 GOOGLE LOGIN BUTTON CLICKED');
    console.log('🌐 Current URL:', window.location.href);

    try {
      console.log('➡️ Calling startGoogleAuth("login")');

      const redirected = startGoogleAuth('login');

      console.log(
        '⬅️ startGoogleAuth returned:',
        redirected
      );

      if (!redirected) {
        /*
         * IMPORTANT:
         * Do NOT fake authentication if Google redirect fails.
         */
        console.error(
          '❌ Google authentication did not redirect'
        );

        return;
      }

      console.log('✅ Google OAuth redirect initiated');
    } catch (error) {
      console.error(
        '❌ Google OAuth startup failed:',
        error
      );
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <div className="auth-brand-badge">
          <Icon name="logo" />
        </div>

        <span className="auth-brand-name">
          MediTrack
        </span>
      </header>

      <main className="auth-main-wrap">
        <div className="auth-box">

          <div className="auth-header">
            <h1 className="auth-heading">
              Welcome back
            </h1>

            <p className="auth-subtext">
              Don&apos;t have an account?{' '}

              <Link
                to="/signup"
                className="auth-subtext-link"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Google OAuth */}
          <GoogleAuthButton
            label="Continue with Google"
            onClick={handleGoogleLogin}
          />

          <div className="auth-or-divider">
            OR
          </div>

          {/* Email/password login */}
          <form onSubmit={handleSubmit}>
            <div className="auth-form-fields">

              <div className="field-group">
                <label
                  className="field-label"
                  htmlFor="login-email"
                >
                  Email
                </label>

                <input
                  id="login-email"
                  className="field-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>

              <div className="field-group">
                <label
                  className="field-label"
                  htmlFor="login-password"
                >
                  Password
                </label>

                <input
                  id="login-password"
                  className="field-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="auth-primary-btn"
            >
              Log in
            </button>
          </form>

          {/* Temporary demo login */}
          <button
            type="button"
            className="demo-login-btn"
            onClick={handleSubmit}
          >
            Demo: 1-Click Quick Login
          </button>

        </div>
      </main>
    </div>
  );
}

export default Login;