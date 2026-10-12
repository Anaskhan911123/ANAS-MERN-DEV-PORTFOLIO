import { useEffect, useState } from 'react';
import { IconSearch, IconBell, IconPlus, IconUser } from '@tabler/icons-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', membershipId: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadMembers = () => {
    api.get('/members')
      .then(({ data }) => setMembers(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load members'));
  };

  useEffect(() => { loadMembers(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/members', form);
      setForm({ name: '', email: '', phone: '', membershipId: '' });
      setShowForm(false);
      loadMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    try {
      await api.delete(`/members/${id}`);
      loadMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete member');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Members</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>Manage library members</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconSearch size={18} color="var(--indigo-tint-text)" />
            <IconBell size={18} color="var(--pink)" />
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--teal)', color: '#04342C', border: 'none',
                padding: '8px 14px', borderRadius: 'var(--radius)', fontWeight: 500
              }}
            >
              <IconPlus size={16} /> Add member
            </button>
          </div>
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            background: 'var(--surface-2)', border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.25rem',
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10
          }}>
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <input name="membershipId" placeholder="Membership ID" value={form.membershipId} onChange={handleChange} required />
            <button type="submit" disabled={submitting} style={{
              background: 'var(--teal)', color: '#04342C', border: 'none',
              borderRadius: 'var(--radius)', fontWeight: 500, padding: '8px 0',
              gridColumn: 'span 2'
            }}>
              {submitting ? 'Adding...' : 'Save member'}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {members.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No members yet.</p>
          )}
          {members.map((m) => (
            <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '0.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--pink-tint-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconUser size={16} color="var(--pink-tint-text-dark)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{m.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  {m.email} · {m.membershipId}
                </p>
              </div>
              <span style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 'var(--radius)',
                background: m.status === 'active' ? 'var(--teal-tint-bg)' : 'var(--red-tint-bg)',
                color: m.status === 'active' ? 'var(--teal-tint-text-dark)' : 'var(--red-tint-text-dark)'
              }}>
                {m.status}
              </span>
              <button onClick={() => handleDelete(m._id)} style={{
                background: 'var(--red-tint-bg)', color: 'var(--red-tint-text)', border: 'none',
                borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 12
              }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}