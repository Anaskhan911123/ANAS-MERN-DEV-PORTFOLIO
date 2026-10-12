import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import StatusPill from '../components/StatusPill';

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, examsRes] = await Promise.all([
          api.get('/attempts/overview'),
          api.get('/exams'),
        ]);
        setStats(statsRes.data);
        setExams(examsRes.data.exams);
      } catch (err) {
        setError('Could not load your dashboard. Try refreshing.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function statusFor(exam) {
    if (exam.attempt?.status === 'submitted') return 'graded';
    if (exam.attempt?.status === 'in-progress') return 'in-progress';
    return 'upcoming';
  }

  function handleRowClick(exam) {
    if (exam.attempt?.status === 'submitted') {
      navigate(`/results/${exam.attempt.id}`);
    } else {
      navigate(`/exam/${exam._id}`);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <TopBar title="Overview" />
        <div className="page-content">
          {loading && <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Loading…</div>}
          {error && <div className="error-text">{error}</div>}

          {!loading && !error && (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <StatCard label="Upcoming" value={stats.upcomingCount} color="var(--color-indigo)" />
                <StatCard label="Avg score" value={`${stats.averageScore}%`} color="var(--color-amber)" />
                <StatCard label="Graded" value={stats.gradedCount} color="var(--color-green)" />
              </div>

              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                {exams.length === 0 && (
                  <div style={{ padding: 16, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    No exams scheduled yet.
                  </div>
                )}
                {exams.map((exam, i) => (
                  <div
                    key={exam._id}
                    onClick={() => handleRowClick(exam)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: i < exams.length - 1 ? '1px solid var(--color-border)' : 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{exam.title}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{exam.subject}</div>
                    </div>
                    <StatusPill status={statusFor(exam)} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}