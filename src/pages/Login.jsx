import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserAuth } from '../hooks/useUserAuth';
import Meteors from '../components/Meteors';

export default function Login() {
  const { signIn, loading, user } = useUserAuth();
  const [error, setError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      setError('');
      await signIn();
      // Navigation will happen automatically via auth state change
    } catch (err) {
      console.error('Sign-in error:', err);
      if (err.message?.includes('popup')) {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else {
        setError('Sign-in failed: ' + (err.message || 'Please try again.'));
      }
    } finally {
      setSigningIn(false);
    }
  };

  // Button should only be disabled while actively signing in
  const buttonDisabled = signingIn;

  return (
    <div className="login-page">
      <Meteors />

      <div className="login-center">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Link to="/" className="login-logo">
            <img src="/assets/logo/Synthica Logo.png" alt="Synthica" className="login-logo-img" />
            <span>Synthica</span>
          </Link>

          <h1 className="login-title">
            Welcome to the <span className="yellow-text">Portal</span>
          </h1>
          <p className="login-subtitle">
            Sign in with your Google account to access your dashboard, projects, and resources.
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={buttonDisabled}
          >
            {signingIn ? (
              <div className="btn-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {signingIn ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p className="login-note">
            Your role (Chapter Leader, Lead Researcher, etc.) is assigned by Synthica admins after you sign up. New members will see a pending state until their role is confirmed.
          </p>

          <div className="login-divider" />
          <Link to="/" className="login-back">← Back to Synthica.org</Link>
        </motion.div>
      </div>
    </div>
  );
}
