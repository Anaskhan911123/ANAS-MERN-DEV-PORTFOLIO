export default function StatCard({ label, value, color = 'var(--color-indigo)' }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        borderLeft: `3px solid ${color}`,
        padding: 'var(--space-4)',
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, marginTop: 4 }}>{value}</div>
    </div>
  );
}