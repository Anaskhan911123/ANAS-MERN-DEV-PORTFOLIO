import { useEffect, useState } from 'react';

// Counts down from totalSeconds and calls onExpire once when it hits zero.
export default function Timer({ totalSeconds, onExpire }) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire && onExpire();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isCritical = remaining < 60;

  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        padding: '3px 10px',
        borderRadius: 12,
        background: isCritical ? 'var(--color-red-light)' : 'var(--color-amber-light)',
        color: isCritical ? 'var(--color-red-dark)' : 'var(--color-amber-dark)',
      }}
    >
      {display}
    </span>
  );
}