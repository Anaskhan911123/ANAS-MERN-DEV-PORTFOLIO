import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-primary p-2 rounded-xl"><Briefcase className="text-white" size={20} /></div>
          <span className="text-ink text-xl font-extrabold">EmpTrack</span>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-1">Create an account</h1>
        <p className="text-gray-500 mb-6 text-sm">Set up access to the HR workspace.</p>
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition" placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary2 transition">
            Create Account
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-6 text-center">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;