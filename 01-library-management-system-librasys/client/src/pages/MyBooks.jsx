import { useEffect, useState } from 'react';
import { IconBook2, IconSearch, IconBell } from '@tabler/icons-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

export default function MyBooks() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    api.get('/transactions/my')
      .then(({ data }) => setTransactions(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load your books'));
  }, []);

  const statusColor = (status) => {
    if (status === 'overdue') return { bg: 'var(--red-tint-bg)', text: 'var(--red-tint-text-dark)' };
    if (status === 'returned') return { bg: 'var(--surface-1)', text: 'var(--text-secondary)' };
    return { bg: 'var(--teal-tint-bg)', text: 'var(--teal-tint-text-dark)' };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>My books</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Welcome back{user?.name ? `, ${user.name}` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconSearch size={18} color="var(--indigo-tint-text)" />
            <IconBell size={18} color="var(--pink)" />
          </div>
        </div>

        {error && (
          <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>
            {error}
            {error.includes('not linked') && ' — ask an admin to link your account to a member record.'}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transactions.length === 0 && !error && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>You have no book history yet.</p>
          )}
          {transactions.map((t) => {
            const c = statusColor(t.status);
            return (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '0.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--indigo-tint-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconBook2 size={16} color="var(--indigo-tint-text-dark)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.book?.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    Due {new Date(t.dueDate).toLocaleDateString()}
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