import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TeamsPanel from '../components/TeamsPanel';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: 40, color: '#fff', background: '#0d1117', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#f0b429', fontSize: 28, fontWeight: 700 }}>🏆 FIFA World Cup 2026</h1>
          <p style={{ marginTop: 8, color: '#6b7280' }}>Bienvenido, {user?.name}</p>
          <p style={{ color: '#6b7280' }}>Rol: {user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 24px',
            background: '#f0b429',
            color: '#0d1117',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {isAdmin && (
        <div style={{ marginTop: 32 }}>
          <TeamsPanel />
        </div>
      )}

      {!isAdmin && (
        <div style={{ marginTop: 32, padding: 24, background: '#161b22', borderRadius: 12, border: '1px solid #2a2f38' }}>
          <h2 style={{ color: '#f0b429', fontSize: 20, marginBottom: 16 }}>📊 Tu Predictor</h2>
          <p style={{ color: '#6b7280' }}>Pronto podrás hacer tus predicciones para los partidos del Mundial.</p>
        </div>
      )}
    </div>
  );
}