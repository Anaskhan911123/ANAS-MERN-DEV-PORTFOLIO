import { NavLink } from 'react-router-dom';
import { Command, LayoutGrid, ArrowUpDown, PanelsTopLeft, Settings, MoreHorizontal } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const navClass = ({ isActive }) => 'nav-item' + (isActive ? ' nav-item-active' : '');

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark" />
        <span>stockwise</span>
      </div>

      <div className="eyebrow sidebar-label">Workspace</div>

      <nav className="nav-list">
        <NavLink to="/" end className={navClass}>
          <Command size={18} /> Overview
        </NavLink>
        <NavLink to="/inventory" className={navClass}>
          <LayoutGrid size={18} /> Inventory
        </NavLink>
        <NavLink to="/stock-activity" className={navClass}>
          <ArrowUpDown size={18} /> Stock activity
        </NavLink>
        <NavLink to="/reports" className={navClass}>
          <PanelsTopLeft size={18} /> Reports
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item settings-item">
          <Settings size={18} /> Settings
        </div>
        <div className="user-row">
          <div className="avatar">AM</div>
          <div className="user-info">
            <div className="user-name">Alex Morgan</div>
            <div className="user-role">Operations</div>
          </div>
          <MoreHorizontal size={16} className="more-icon" />
        </div>
      </div>
    </aside>
  );
}