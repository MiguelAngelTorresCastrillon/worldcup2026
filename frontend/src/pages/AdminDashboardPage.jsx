import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>🏆</span>
          <h1 style={styles.title}>FIFA World Cup 2026</h1>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.badge}>ADMIN</span>
          <span style={styles.userName}>{user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.welcome}>
          <h2 style={styles.welcomeTitle}>Panel de Administración</h2>
          <p style={styles.welcomeText}>
            Bienvenido, {user?.name}. Desde aquí podés gestionar usuarios y contenido.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{users.length}</div>
              <div style={styles.statLabel}>Usuarios Totales</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👤</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>
                {users.filter(u => u.role === 'USER').length}
              </div>
              <div style={styles.statLabel}>Usuarios Regulares</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🛡️</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>
                {users.filter(u => u.role === 'ADMIN').length}
              </div>
              <div style={styles.statLabel}>Administradores</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>Gestión de Usuarios</h3>
          
          {error && (
            <div style={styles.error}>{error}</div>
          )}

          {loading ? (
            <div style={styles.loading}>Cargando usuarios...</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Rol</th>
                    <th style={styles.th}>Fecha de Registro</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          {u.picture && (
                            <img src={u.picture} alt="" style={styles.userAvatar} />
                          )}
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.roleBadge,
                          backgroundColor: u.role === 'ADMIN' ? '#f0b429' : '#2d333b',
                          color: u.role === 'ADMIN' ? '#0d1117' : '#fff'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(u.created_at)}</td>
                      <td style={styles.td}>
                        <button style={styles.actionBtn}>Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsGrid}>
          <div style={styles.actionCard}>
            <div style={styles.actionIcon}>📊</div>
            <h4 style={styles.actionTitle}>Estadísticas</h4>
            <p style={styles.actionText}>Ver análisis y métricas del predictor</p>
          </div>
          <div style={styles.actionCard}>
            <div style={styles.actionIcon}>⚽</div>
            <h4 style={styles.actionTitle}>Gestionar Partidos</h4>
            <p style={styles.actionText}>Configurar partidos y predicciones</p>
          </div>
          <div style={styles.actionCard}>
            <div style={styles.actionIcon}>📧</div>
            <h4 style={styles.actionTitle}>Notificaciones</h4>
            <p style={styles.actionText}>Enviar announcements a usuarios</p>
          </div>
          <div style={styles.actionCard}>
            <div style={styles.actionIcon}>⚙️</div>
            <h4 style={styles.actionTitle}>Configuración</h4>
            <p style={styles.actionText}>Ajustes generales del sistema</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 FIFA World Cup Predictor - Panel de Administración</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0d1117',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#161b22',
    borderBottom: '1px solid #2a2f38',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    fontSize: '28px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
    color: '#f0b429',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  badge: {
    backgroundColor: '#f0b429',
    color: '#0d1117',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
  userName: {
    color: '#9ca3af',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #2a2f38',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px',
  },
  welcome: {
    marginBottom: '32px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#fff',
  },
  welcomeText: {
    color: '#9ca3af',
    fontSize: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#161b22',
    border: '1px solid #2a2f38',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    fontSize: '32px',
  },
  statContent: {},
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#f0b429',
  },
  statLabel: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  tableContainer: {
    backgroundColor: '#161b22',
    border: '1px solid #2a2f38',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#fff',
  },
  error: {
    backgroundColor: '#2d1515',
    border: '1px solid #7f1d1d',
    color: '#fca5a5',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  loading: {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '40px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '1px solid #2a2f38',
    color: '#9ca3af',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tr: {
    borderBottom: '1px solid #2a2f38',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#fff',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  roleBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: '#2d333b',
    border: 'none',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  actionCard: {
    backgroundColor: '#161b22',
    border: '1px solid #2a2f38',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  actionIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#fff',
  },
  actionText: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    color: '#6b7280',
    fontSize: '12px',
    borderTop: '1px solid #2a2f38',
    marginTop: '32px',
  },
};
