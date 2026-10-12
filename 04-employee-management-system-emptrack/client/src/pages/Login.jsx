import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-primary p-2 rounded-xl"><Briefcase className="text-white" size={20} /></div>
          <span className="text-ink text-xl font-extrabold">EmpTrack</span>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-1">Welcome back</h1>
        <p className="text-gray-500 mb-6 text-sm">Sign in to manage your workforce.</p>
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary2 transition">
            Sign In
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-6 text-center">
          Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;