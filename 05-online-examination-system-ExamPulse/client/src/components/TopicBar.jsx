export default function TopicBar({ topic, correct, total }) {
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const color = percent >= 70 ? 'var(--color-indigo)' : percent >= 40 ? 'var(--color-amber)' : 'var(--color-red)';

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span>{topic}</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>
          {correct}/{total}
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3 }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}