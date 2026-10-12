import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBooks } from '@tabler/icons-react';
import api from '../api/axios';

export default function Login() {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password, role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--surface-1)'
    }}>
      <form onSubmit={handleSubmit} style={{
        width: 300, background: 'var(--surface-2)', border: '0.5px solid var(--border)',
        borderRadius: 12, padding: '1.75rem 1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: 'var(--teal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10
          }}>
            <IconBooks size={20} color="var(--teal-tint-bg)" />
          </div>
          <p style={{ fontSize: 17, fontWeight: 500, margin: 0 }}>Welcome to LibraSys</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0', textAlign: 'center' }}>
            Sign in to manage your library
          </p>
        </div>

        <div style={{
          display: 'flex', gap: 4, background: 'var(--surface-1)',
          borderRadius: 'var(--radius)', padding: 3, marginBottom: '1.25rem'
        }}>
          {['admin', 'member'].map((r) => (
            <div
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 6,
                fontSize: 13, cursor: 'pointer',
                fontWeight: role === r ? 500 : 400,
                background: role === r ? 'var(--indigo-tint-bg)' : 'transparent',
                color: role === r ? 'var(--indigo)' : 'var(--text-secondary)'
              }}
            >
              {r === 'admin' ? 'Admin' : 'Member'}
            </div>
          ))}
        </div>

        <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Email</label>
        <input
          type="text" placeholder="name@library.edu" value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 12, boxSizing: 'border-box' }}
        />

        <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Password</label>
        <input
          type="password" placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 6, boxSizing: 'border-box' }}
        />

        {error && (
          <p style={{ fontSize: 12, color: 'var(--red)', margin: '0 0 12px' }}>{error}</p>
        )}

        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--indigo-tint-text)', cursor: 'pointer' }}>Forgot password?</span>
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', background: 'var(--teal)', border: 'none', color: '#04342C',
          fontWeight: 500, padding: '10px 0', borderRadius: 'var(--radius)',
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', margin: '14px 0 0' }}>
          New member? <span style={{ color: 'var(--pink)', cursor: 'pointer' }}>Register here</span>
        </p>
      </form>
    </div>
  );
}