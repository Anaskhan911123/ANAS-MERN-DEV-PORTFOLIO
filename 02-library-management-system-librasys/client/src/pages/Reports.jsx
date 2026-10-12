import { useEffect, useState } from 'react';
import { IconSearch, IconBell, IconChartBar } from '@tabler/icons-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/transactions')
      .then(({ data }) => setTransactions(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load report data'));
  }, []);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);

  const counts = {
    all: transactions.length,
    issued: transactions.filter(t => t.status === 'issued').length,
    overdue: transactions.filter(t => t.status === 'overdue').length,
    returned: transactions.filter(t => t.status === 'returned').length,
  };

  const statusColor = (status) => {
    if (status === 'overdue') return { bg: 'var(--red-tint-bg)', text: 'var(--red-tint-text-dark)' };
    if (status === 'returned') return { bg: 'var(--surface-1)', text: 'var(--text-secondary)' };
    return { bg: 'var(--teal-tint-bg)', text: 'var(--teal-tint-text-dark)' };
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'issued', label: 'Issued' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'returned', label: 'Returned' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Reports</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>Transaction history and trends</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconSearch size={18} color="var(--indigo-tint-text)" />
            <IconBell size={18} color="var(--pink)" />
          </div>
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          {filters.map(f => (
            <div
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer',
                fontWeight: filter === f.key ? 500 : 400,
                background: filter === f.key ? 'var(--indigo-tint-bg)' : 'var(--surface-2)',
                color: filter === f.key ? 'var(--indigo)' : 'var(--text-secondary)',
                border: '0.5px solid var(--border)',
              }}
            >
              {f.label} ({counts[f.key]})
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No transactions match this filter.</p>
          )}
          {filtered.map((t) => {
            const c = statusColor(t.status);
            return (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '0.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--indigo-tint-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconChartBar size={16} color="var(--indigo-tint-text-dark)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.book?.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    {t.member?.name} · Issued {new Date(t.issueDate).toLocaleDateString()} · Due {new Date(t.dueDate).toLocaleDateString()}
                    {t.returnDate && ` · Returned ${new Date(t.returnDate).toLocaleDateString()}`}
                  </p>
                </div>
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 'var(--radius)', background: c.bg, color: c.text }}>
                  {t.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}