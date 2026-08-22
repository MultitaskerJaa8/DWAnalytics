import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { User, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../utils/helpers';

const Profile = () => {
  const { user, updateUserInContext } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(profileData);
      updateUserInContext(data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            <div className="mb-8">
              <h1 className="section-title">My Profile</h1>
              <p className="section-subtitle">Manage your account settings and information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {getInitials(user?.name)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{user?.designation}</p>
                <p className="text-xs text-gray-500">{user?.employeeId}</p>
                <div className="mt-6 pt-6 border-t border-gray-200 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-semibold text-gray-900">{user?.department?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Role:</span>
                    <span className="badge bg-primary-100 text-primary-800 border-primary-300 capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="badge bg-green-100 text-green-800 border-green-300">
                      {user?.employmentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-semibold text-gray-900">{formatDate(user?.joiningDate)}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="card">
                  <div className="flex space-x-4 border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`pb-3 px-4 font-semibold transition-colors ${
                        activeTab === 'profile'
                          ? 'border-b-2 border-primary-700 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Profile Info
                    </button>
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`pb-3 px-4 font-semibold transition-colors ${
                        activeTab === 'password'
                          ? 'border-b-2 border-primary-700 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Lock className="w-4 h-4 inline mr-2" />
                      Change Password
                    </button>
                  </div>

                  {activeTab === 'profile' && (
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <div>
                        <label className="label-text">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label-text">Email (Cannot be changed)</label>
                        <input type="email" value={user?.email} className="input-field bg-gray-100" disabled />
                      </div>
                      <div>
                        <label className="label-text">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </form>
                  )}

                  {activeTab === 'password' && (
                    <form onSubmit={handlePasswordChange} className="space-y-5">
                      <div>
                        <label className="label-text">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="label-text">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="input-field"
                          minLength={6}
                          required
                        />
                      </div>
                      <div>
                        <label className="label-text">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="input-field"
                          minLength={6}
                          required
                        />
                      </div>
                      <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Profile;