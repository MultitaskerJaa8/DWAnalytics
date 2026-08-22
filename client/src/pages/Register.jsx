import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { departmentAPI } from '../utils/api';
import { BarChart3, UserPlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [formData, setFormData] = useState({
    employeeId: '', name: '', email: '', password: '', department: '',
    designation: '', phone: '', role: 'employee',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Agar already logged in hai to redirect karo
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoadingDepts(true);
      const { data } = await departmentAPI.getAll();
      if (data && data.departments) {
        setDepartments(data.departments);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('Department fetch error:', error);
      toast.error('Failed to load departments. Please refresh the page.');
      // Fallback departments (agar API fail ho)
      setDepartments([
        { _id: 'temp1', name: 'Information Technology', code: 'IT' },
        { _id: 'temp2', name: 'Human Resources', code: 'HR' },
        { _id: 'temp3', name: 'Public Works', code: 'PWD' },
        { _id: 'temp4', name: 'Finance & Accounts', code: 'FIN' },
        { _id: 'temp5', name: 'Health Services', code: 'HLT' },
      ]);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.department) {
      toast.error('Please select a department');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/employee-dashboard', { replace: true });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card max-w-2xl">
        <div className="auth-logo">
          <BarChart3 className="w-12 h-12 text-white" />
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Register for Digital Workforce Analytics Platform</p>

        {loadingDepts && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">Loading departments...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employee ID *</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                className="auth-input"
                placeholder="EMP001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="auth-input"
                placeholder="Ashish Solanki"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="auth-input"
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="auth-input select-field"
                required
                disabled={loadingDepts}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
              {departments.length === 0 && !loadingDepts && (
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  No departments available. Contact admin.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Designation *</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="auth-input"
                placeholder="e.g., Software Developer"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="auth-input"
                placeholder="7895227827"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="auth-input select-field"
              >
                <option value="employee">Employee</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || loadingDepts || departments.length === 0} 
            className="auth-button flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
