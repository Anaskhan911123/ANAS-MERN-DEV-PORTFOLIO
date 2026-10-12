import { useEffect, useState } from 'react';
import {
  IconBooks, IconArrowsExchange, IconUsers, IconAlertTriangle,
  IconSearch, IconBell, IconBook2
} from '@tabler/icons-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

function statusStyle(status) {
  if (status === 'overdue') {
    return { bar: 'var(--red)', badgeBg: 'var(--red-tint-bg)', badgeText: 'var(--red-tint-text-dark)', label: 'Overdue' };
  }
  return { bar: 'var(--teal)', badgeBg: 'var(--teal-tint-bg)', badgeText: 'var(--teal-tint-text-dark)', label: 'Issued' };
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'));
  }, []);

  const cards = stats ? [
    { icon: IconBooks, label: 'Total books', value: stats.totalBooks, bg: 'var(--indigo-tint-bg)', iconBg: 'var(--indigo-tint-icon)', iconColor: 'var(--indigo-tint-text-dark)', textColor: 'var(--indigo-tint-text)', valueColor: 'var(--indigo)' },
    { icon: IconArrowsExchange, label: 'Issued', value: stats.issuedCount, bg: 'var(--teal-tint-bg)', iconBg: '#9FE1CB', iconColor: 'var(--teal-tint-text-dark)', textColor: 'var(--teal-tint-text)', valueColor: '#04342C' },
    { icon: IconUsers, label: 'Members', value: stats.totalMembers, bg: 'var(--pink-tint-bg)', iconBg: 'var(--pink-tint-icon)', iconColor: 'var(--pink-tint-text-dark)', textColor: 'var(--pink-tint-text)', valueColor: '#4B1528' },
    { icon: IconAlertTriangle, label: 'Overdue', value: stats.overdueCount, bg: 'var(--red-tint-bg)', iconBg: 'var(--red-tint-icon)', iconColor: 'var(--red-tint-text-dark)', textColor: 'var(--red-tint-text)', valueColor: '#501313' },
  ] : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Dashboard</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>Overview of your library</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconSearch size={18} color="var(--indigo-tint-text)" style={{ cursor: 'pointer' }} />
            <IconBell size={18} color="var(--pink)" style={{ cursor: 'pointer' }} />
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, color: '#FBEAF0' }}>
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
            </div>
          </div>
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: 13 }}>{error}</p>}

        {stats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12, marginBottom: '1.5rem' }}>
              {cards.map(({ icon: Icon, label, value, bg, iconBg, iconColor, textColor, valueColor }) => (
                <div key={label} style={{ background: bg, borderRadius: 'var(--radius)', padding: '1rem' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <Icon size={15} color={iconColor} />
                  </div>
                  <p style={{ fontSize: 13, color: textColor, margin: '0 0 4px' }}>{label}</p>
                  <p style={{ fontSize: 22, fontWeight: 500, margin: 0, color: valueColor }}>{value}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 16, fontWeight: 500, margin: '0 0 10px' }}>Recently issued</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.recentlyIssued.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No books currently issued.</p>
              )}
              {stats.recentlyIssued.map((t) => {
                const s = statusStyle(t.status);
                return (
                  <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '0.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: s.bar, flexShrink: 0 }} />
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--indigo-tint-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconBook2 size={16} color="var(--indigo-tint-text-dark)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.book?.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>Issued to {t.member?.name}</p>
                    </div>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 'var(--radius)', background: s.badgeBg, color: s.badgeText, flexShrink: 0 }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}