import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <div className={styles.logo}>🏆</div>
        <h1 className={styles.title}>FIFA World Cup 2026</h1>
        <p className={styles.subtitle}>AI-POWERED PREDICTOR & LIVE TRACKER</p>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>User</button>
          <button className={styles.tab}>Administrator</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrap}>
              <span className={styles.icon}>✉</span>
              <input
                className={styles.input}
                type="email"
                placeholder="admin@worldcup.com"
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

          <div className={styles.forgot}>
            <a href="#">Forgot Password?</a>
          </div>

          <button className={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}><span>OR CONTINUE WITH</span></div>

        <button className={styles.btnGoogle}>
          <span>G</span> Continue with Google
        </button>

        <p className={styles.switch}>
          Don't have an account?{' '}
          <Link to="/register">Create an Account</Link>
        </p>

        <p className={styles.footer}>🛡 PROTECTED BY 256-BIT ENCRYPTION</p>
      </div>
      <p className={styles.copy}>© 2026 FIFA World Cup Predictor - V.1.0.0</p>
    </div>
  );
}