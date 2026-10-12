import { useEffect, useState } from 'react';
import { IconSearch, IconBell, IconArrowsExchange } from '@tabler/icons-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

export default function IssueReturn() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ bookId: '', memberId: '', dueInDays: 14 });
  const [submitting, setSubmitting] = useState(false);

  const loadAll = () => {
    api.get('/books').then(({ data }) => setBooks(data)).catch(() => {});
    api.get('/members').then(({ data }) => setMembers(data)).catch(() => {});
    api.get('/transactions').then(({ data }) => setTransactions(data)).catch((err) =>
      setError(err.response?.data?.message || 'Failed to load transactions')
    );
  };

  useEffect(() => { loadAll(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/transactions/issue', {
        bookId: form.bookId,
        memberId: form.memberId,
        dueInDays: Number(form.dueInDays),
      });
      setForm({ bookId: '', memberId: '', dueInDays: 14 });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await api.put(`/transactions/return/${id}`);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    }
  };

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
            <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Issue / Return</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>Manage book lending</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconSearch size={18} color="var(--indigo-tint-text)" />
            <IconBell size={18} color="var(--pink)" />
          </div>
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleIssue} style={{
          background: 'var(--surface-2)', border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, alignItems: 'end'
        }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Book</label>
            <select name="bookId" value={form.bookId} onChange={handleChange} required
              style={{ width: '100%', boxSizing: 'border-box', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 10px' }}>
              <option value="">Select book</option>
              {books.filter(b => b.availableCopies > 0).map((b) => (
                <option key={b._id} value={b._id}>{b.title} ({b.availableCopies} left)</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Member</label>
            <select name="memberId" value={form.memberId} onChange={handleChange} required
              style={{ width: '100%', boxSizing: 'border-box', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 10px' }}>
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.name} ({m.membershipId})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Due in (days)</label>
            <input name="dueInDays" type="number" min="1" value={form.dueInDays} onChange={handleChange}
              style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={submitting} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: 'var(--teal)', color: '#04342C', border: 'none',
            padding: '9px 0', borderRadius: 'var(--radius)', fontWeight: 500
          }}>
            <IconArrowsExchange size={16} /> {submitting ? 'Issuing...' : 'Issue book'}
          </button>
        </form>

        <p style={{ fontSize: 16, fontWeight: 500, margin: '0 0 10px' }}>All transactions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transactions.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No transactions yet.</p>
          )}
          {transactions.map((t) => {
            const c = statusColor(t.status);
            return (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '0.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.book?.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    {t.member?.name} · Due {new Date(t.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 'var(--radius)', background: c.bg, color: c.text }}>
                  {t.status}
                </span>
                {t.status !== 'returned' && (
                  <button onClick={() => handleReturn(t._id)} style={{
                    background: 'var(--indigo-tint-bg)', color: 'var(--indigo-tint-text)', border: 'none',
                    borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 12
                  }}>
                    Return
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}