import { Outlet } from 'react-router-dom';
import { Sparkles, HelpCircle } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <div className="top-bar">
          <button className="icon-btn"><Sparkles size={16} /></button>
          <button className="icon-btn"><HelpCircle size={16} /></button>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}