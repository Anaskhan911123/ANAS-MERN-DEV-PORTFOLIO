import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ProgressRing from '../components/ProgressRing';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState({ overdue: [], dueSoon: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, remindersRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/tasks/reminders'),
        ]);
        setStats(statsRes.data);
        setReminders(remindersRes.data);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
      }
    };
    fetchStats();
  }, []);

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="page-container">
          <p className="auth-error">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return <div><Navbar /><div className="page-container">Loading...</div></div>;

  const { overall, categoryStats } = stats;

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h1>Dashboard</h1>

        <div className="stat-cards">
          <div className="stat-card"><span className="stat-number">{overall.total}</span><span>Total Tasks</span></div>
          <div className="stat-card"><span className="stat-number">{overall.completed}</span><span>Completed</span></div>
          <div className="stat-card"><span className="stat-number">{overall.inProgress}</span><span>In Progress</span></div>
          <div className="stat-card overdue-card"><span className="stat-number">{overall.overdue}</span><span>Overdue</span></div>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <h3>Overall Completion</h3>
            <ProgressRing percent={overall.completionRate} size={120} stroke={10} />
          </div>

          <div className="panel">
            <h3>Progress by Category</h3>
            <div className="category-progress-list">
              {categoryStats.length === 0 && <p style={{fontSize:'13px',color:'var(--text-muted)'}}>No tasks yet.</p>}
              {categoryStats.map((c) => (
                <div key={c._id || 'none'} className="category-progress-row">
                  <ProgressRing percent={c.progress} size={56} stroke={5} color={c.color} />
                  <div>
                    <strong>{c.name}</strong>
                    <p>{c.completed}/{c.total} tasks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Reminders</h3>
            {reminders.overdue.length === 0 && reminders.dueSoon.length === 0 && <p>You're all caught up.</p>}
            {reminders.overdue.map((t) => (
              <div key={t._id} className="reminder-row overdue">⚠ {t.title} — overdue</div>
            ))}
            {reminders.dueSoon.map((t) => (
              <div key={t._id} className="reminder-row">⏰ {t.title} — due soon</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;