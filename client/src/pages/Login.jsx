import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3, LogIn } from 'lucide-react';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') navigate('/admin-dashboard');
      else if (result.user.role === 'supervisor') navigate('/supervisor-dashboard');
      else navigate('/employee-dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <BarChart3 className="w-12 h-12 text-white" />
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Digital Workforce Performance Analytics Platform</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="auth-input"
              placeholder="your@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="auth-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button flex items-center justify-center space-x-2">
            <LogIn className="w-5 h-5" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </div>

        </div>
    </div>
  );
};

export default Login;
