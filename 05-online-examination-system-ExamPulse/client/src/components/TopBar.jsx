import { useAuth } from '../context/AuthContext';

export default function TopBar({ title }) {
  const { user } = useAuth();

  return (
    <div
      style={{
        height: 56,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-5)',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
        {user ? user.name : ''}
      </div>
    </div>
  );
}