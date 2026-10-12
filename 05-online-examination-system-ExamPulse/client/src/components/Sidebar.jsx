import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '10px 12px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 4,
    color: isActive ? '#818cf8' : '#94a3b8',
    background: isActive ? '#1e1b4b' : 'transparent',
  });

  return (
    <div
      style={{
        width: 200,
        background: 'var(--color-navy)',
        padding: '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 500, marginBottom: 20, paddingLeft: 4 }}>
          ExamPulse
        </div>
        <NavLink to="/overview" style={linkStyle}>
          Overview
        </NavLink>
        <NavLink to="/overview" style={linkStyle}>
          My exams
        </NavLink>
      </div>
      <button
        onClick={logout}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          fontSize: 13,
          textAlign: 'left',
          padding: '10px 12px',
        }}
      >
        Sign out
      </button>
    </div>
  );
}