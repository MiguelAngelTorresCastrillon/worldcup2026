import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';
import authService from '../services/auth.service';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('USER'); // USER o ADMIN
  
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      
      // Si eligió tab ADMIN pero no es admin, mostrar error
      if (activeTab === 'ADMIN' && result.user?.role !== 'ADMIN') {
        setError('Acceso denegado. Este usuario no tiene permisos de administrador.');
        return;
      }
      
      // Redirigir según rol
      if (result.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleToken) => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await authService.googleLogin(googleToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      
      // Si eligió tab ADMIN pero no es admin, mostrar error
      if (activeTab === 'ADMIN' && res.data.user?.role !== 'ADMIN') {
        setError('Acceso denegado. Este usuario no tiene permisos de administrador.');
        setGoogleLoading(false);
        return;
      }
      
      // Redirigir según rol
      if (res.data.user?.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error con Google Sign-In');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorMsg) => {
    setError(errorMsg);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotLoading(true);
    try {
      await authService.forgotPassword(forgotEmail);
      setForgotSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el email');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <div className={styles.logo}>🏆</div>
        <h1 className={styles.title}>FIFA World Cup 2026</h1>
        <p className={styles.subtitle}>AI-POWERED PREDICTOR & LIVE TRACKER</p>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'USER' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('USER')}
          >
            User
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'ADMIN' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('ADMIN')}
          >
            Administrator
          </button>
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
                placeholder={activeTab === 'ADMIN' ? "admin@worldcup.com" : "user@worldcup.com"}
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

          {activeTab === 'USER' && (
            <div className={styles.forgot}>
              <button 
                type="button" 
                className={styles.forgotBtn}
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>
            </div>
          )}
          
          <button className={styles.btnPrimary} type="submit" disabled={loading || googleLoading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {activeTab === 'USER' && (
          <>
            <div className={styles.divider}><span>OR CONTINUE WITH</span></div>

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
          </>
        )}

        {activeTab === 'ADMIN' && (
          <p className={styles.adminNote}>
            🔐 Acceso restringido a administradores autorizados
          </p>
        )}

        <p className={styles.switch}>
          Don't have an account?{' '}
          <Link to="/register">Create an Account</Link>
        </p>

        <p className={styles.footer}>🛡 PROTECTED BY 256-BIT ENCRYPTION</p>
      </div>
      <p className={styles.copy}>© 2026 FIFA World Cup Predictor - V.1.0.0</p>

      {/* Modal de Forgot Password */}
      {showForgot && (
        <div className={styles.modalOverlay} onClick={() => { setShowForgot(false); setForgotSuccess(false); setForgotEmail(''); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>🔑 Reset Password</h2>
            
            {forgotSuccess ? (
              <>
                <p className={styles.modalText}>
                  ✅ Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
                </p>
                <p className={styles.modalText} style={{ fontSize: '12px', color: '#6b7280' }}>
                  Revisa tu bandeja de entrada (y spam).
                </p>
                <button 
                  className={styles.btnPrimary} 
                  style={{ marginTop: '16px' }}
                  onClick={() => { setShowForgot(false); setForgotSuccess(false); setForgotEmail(''); }}
                >
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <p className={styles.modalText}>
                  Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleForgotSubmit}>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    style={{ 
                      background: '#0d1117', 
                      border: '1px solid #2a2f38', 
                      padding: '12px 14px', 
                      borderRadius: '8px', 
                      color: '#fff',
                      width: '100%',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <button 
                    type="submit" 
                    className={styles.btnPrimary} 
                    style={{ marginTop: '12px' }}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? 'Enviando...' : 'Enviar Enlace'}
                  </button>
                </form>
                <button 
                  className={styles.forgotBtn} 
                  style={{ marginTop: '8px', fontSize: '13px' }}
                  onClick={() => { setShowForgot(false); setForgotEmail(''); setError(''); }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
