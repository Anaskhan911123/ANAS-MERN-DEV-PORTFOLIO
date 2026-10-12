import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, Building2, BarChart3, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-[#e7ebe5] flex flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="bg-primary p-2 rounded-xl">
          <Briefcase className="text-white" size={20} />
        </div>
        <span className="text-ink text-lg font-extrabold tracking-tight">EmpTrack</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive ? 'bg-primary/10 text-primary2' : 'text-gray-500 hover:bg-gray-50 hover:text-ink'
              }`
            }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#e7ebe5]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: user?.avatarColor }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-ink text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-medium transition">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;