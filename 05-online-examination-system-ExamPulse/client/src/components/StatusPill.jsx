const STATUS_STYLES = {
  upcoming: { bg: 'var(--color-amber-light)', text: 'var(--color-amber-dark)' },
  active: { bg: 'var(--color-indigo-light)', text: 'var(--color-indigo-dark)' },
  closed: { bg: 'var(--color-red-light)', text: 'var(--color-red-dark)' },
  graded: { bg: 'var(--color-green-light)', text: 'var(--color-green-dark)' },
  'in-progress': { bg: 'var(--color-amber-light)', text: 'var(--color-amber-dark)' },
  submitted: { bg: 'var(--color-green-light)', text: 'var(--color-green-dark)' },
};

export default function StatusPill({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.upcoming;
  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        fontSize: 11,
        padding: '3px 10px',
        borderRadius: 12,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  );
}