import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: 40, color: '#fff', background: '#0d1117', minHeight: '100vh' }}>
      <h1 style={{ color: '#f0b429' }}>🏆 FIFA World Cup 2026</h1>
      <p style={{ marginTop: 16, color: '#6b7280' }}>Bienvenido, {user?.name}</p>
      <p style={{ color: '#6b7280' }}>Rol: {user?.role}</p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: 24, padding: '10px 24px',
          background: '#f0b429', color: '#0d1117',
          border: 'none', borderRadius: 8,
          fontWeight: 700, cursor: 'pointer'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}