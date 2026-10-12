import { useEffect, useState } from 'react';
import { IconSearch, IconBell, IconPlus, IconBook2 } from '@tabler/icons-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';

  const loadBooks = () => {
    api.get('/books')
      .then(({ data }) => setBooks(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load books'));
  };

  useEffect(() => { loadBooks(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/books', { ...form, totalCopies: Number(form.totalCopies) });
      setForm({ title: '', author: '', isbn: '', category: '', totalCopies: 1 });
      setShowForm(false);
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Books</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>Manage your catalog</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconSearch size={18} color="var(--indigo-tint-text)" />
            <IconBell size={18} color="var(--pink)" />
            {isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--teal)', color: '#04342C', border: 'none',
                  padding: '8px 14px', borderRadius: 'var(--radius)', fontWeight: 500
                }}
              >
                <IconPlus size={16} /> Add book
              </button>
            )}
          </div>
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            background: 'var(--surface-2)', border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.25rem',
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10
          }}>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
            <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <input name="totalCopies" type="number" min="1" placeholder="Copies" value={form.totalCopies} onChange={handleChange} />
            <button type="submit" disabled={submitting} style={{
              background: 'var(--teal)', color: '#04342C', border: 'none',
              borderRadius: 'var(--radius)', fontWeight: 500, padding: '8px 0'
            }}>
              {submitting ? 'Adding...' : 'Save book'}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {books.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No books yet.</p>
          )}
          {books.map((b) => (
            <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '0.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--indigo-tint-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBook2 size={16} color="var(--indigo-tint-text-dark)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{b.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  {b.author} · {b.category || 'Uncategorized'}
                </p>
              </div>
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 'var(--radius)', background: 'var(--teal-tint-bg)', color: 'var(--teal-tint-text-dark)' }}>
                {b.availableCopies}/{b.totalCopies} available
              </span>
              {isAdmin && (
                <button onClick={() => handleDelete(b._id)} style={{
                  background: 'var(--red-tint-bg)', color: 'var(--red-tint-text)', border: 'none',
                  borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 12
                }}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}