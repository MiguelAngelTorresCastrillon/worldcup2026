import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleToken) => {
    setError('');
    setGoogleLoading(true);
    try {
      const { googleLogin } = await import('../services/auth.service');
      const res = await googleLogin(googleToken);
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Error con Google Sign-In');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorMsg) => {
    setError(errorMsg);
  };

  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <div className={styles.logo}>🏆</div>
        <h1 className={styles.title}>FIFA World Cup 2026</h1>
        <p className={styles.subtitle}>AI-POWERED PREDICTOR & LIVE TRACKER</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrap}>
              <span className={styles.icon}>👤</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Miguel Torres"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrap}>
              <span className={styles.icon}>✉</span>
              <input
                className={styles.input}
                type="email"
                placeholder="miguel@worldcup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.icon}>🔒</span>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button className={styles.btnPrimary} type="submit" disabled={loading || googleLoading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.divider}><span>OR SIGN UP WITH</span></div>

        {googleLoading ? (
          <button className={styles.btnGoogle} disabled>
            <span>⏳</span> Connecting to Google...
          </button>
        ) : (
          <GoogleButton 
            onSuccess={handleGoogleSuccess} 
            onError={handleGoogleError} 
          />
        )}

        <p className={styles.switch}>
          Already have an account?{' '}
          <Link to="/login">Sign In</Link>
        </p>

        <p className={styles.footer}>🛡 PROTECTED BY 256-BIT ENCRYPTION</p>
      </div>
      <p className={styles.copy}>© 2026 FIFA World Cup Predictor - V.1.0.0</p>
    </div>
  );
}
