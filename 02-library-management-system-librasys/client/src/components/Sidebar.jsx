import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconBooks, IconLayoutDashboard, IconBook, IconUsers, IconArrowsExchange, IconChartBar,
} from '@tabler/icons-react';

const adminNavItems = [
  { icon: IconLayoutDashboard, label: 'Dashboard', color: '#CECBF6', path: '/dashboard' },
  { icon: IconBook, label: 'Books', color: '#F0997B', path: '/books' },
  { icon: IconUsers, label: 'Members', color: '#ED93B1', path: '/members' },
  { icon: IconArrowsExchange, label: 'Issue / return', color: '#5DCAA5', path: '/issue-return' },
  { icon: IconChartBar, label: 'Reports', color: '#FAC775', path: '/reports' },
];

const memberNavItems = [
  { icon: IconBook, label: 'My books', color: '#5DCAA5', path: '/my-books' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navItems = user?.role === 'admin' ? adminNavItems : memberNavItems;

  return (
    <div style={{ width: 200, flexShrink: 0, padding: '1.25rem 0.75rem', background: 'var(--indigo)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 0.5rem 1.5rem' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconBooks size={16} color="#04342C" />
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>LibraSys</span>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ icon: Icon, label, color, path }) => {
          const active = location.pathname === path;
          return (
            <div
              key={label}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                borderRadius: 'var(--radius)', background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={17} color={color} />
              <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.75)' }}>
                {label}
              </span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}