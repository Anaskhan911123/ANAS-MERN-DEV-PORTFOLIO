import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!rollNumber.trim() || !password) {
      setError('Enter your roll number and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(rollNumber.trim(), password);
      navigate('/overview');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div
        style={{
          flex: 1.1,
          background: 'var(--color-navy)',
          backgroundImage: 'radial-gradient(var(--color-navy-dot) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ color: '#e2e8f0', fontSize: 20, fontWeight: 500 }}>ExamPulse</div>
        <div>
          <div style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 500, marginBottom: 10, maxWidth: 340 }}>
            Secure exams, instant results
          </div>
          <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, maxWidth: 340 }}>
            Automated grading and topic-level performance for every attempt.
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 28 }}>
            <div>
              <div style={{ color: '#818cf8', fontSize: 24, fontWeight: 500 }}>120+</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>exams held</div>
            </div>
            <div>
              <div style={{ color: '#fbbf24', fontSize: 24, fontWeight: 500 }}>3.2k</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>attempts graded</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <form onSubmit={handleSubmit} style={{ width: 320 }}>
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Sign in</div>

          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Roll number</label>
            <input
              className="field-input"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="2021-SE-045"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 10 }} disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}