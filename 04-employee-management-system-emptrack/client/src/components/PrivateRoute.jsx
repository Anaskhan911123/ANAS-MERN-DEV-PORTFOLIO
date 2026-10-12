import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-canvas text-ink">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;