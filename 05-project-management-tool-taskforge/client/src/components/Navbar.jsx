import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">TaskForge</div>
      <div className="navbar-links">
        <Link to="/board">Board</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/categories">Categories</Link>
      </div>
      <div className="navbar-user">
        <span>{user?.name}</span>
        <button onClick={handleLogout} className="btn-ghost">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;