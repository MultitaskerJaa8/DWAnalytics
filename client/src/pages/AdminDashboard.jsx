import { useState, useEffect } from 'react';
import { reportsAPI, userAPI, kpiAPI, departmentAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import PerformanceChart from '../components/PerformanceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Building2, Target, CheckCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [deptAnalytics, setDeptAnalytics] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, analyticsRes, usersRes] = await Promise.all([
        reportsAPI.getDashboardStats(),
        reportsAPI.getDepartmentAnalytics(),
        userAPI.getAll({ limit: 5 }),
      ]);
      setStats(statsRes.data.stats);
      setDeptAnalytics(analyticsRes.data.analytics);
      setRecentUsers(usersRes.data.users.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading admin dashboard..." />;

  const chartData = deptAnalytics.map((d) => ({
    name: d.code,
    value: d.averageScore,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            <div className="mb-8">
              <h1 className="section-title">Admin Dashboard</h1>
              <p className="section-subtitle">System-wide analytics and management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatsCard title="Total Employees" value={stats.totalEmployees || 0} icon={Users} color="primary" />
              <StatsCard title="Departments" value={stats.totalDepartments || 0} icon={Building2} color="info" />
              <StatsCard title="Active KPIs" value={stats.totalKPIs || 0} icon={Target} color="success" />
              <StatsCard title="Pending Approvals" value={stats.pendingApprovals || 0} icon={TrendingUp} color="warning" />
              <StatsCard title="Approved (Month)" value={stats.approvedThisMonth || 0} icon={CheckCircle} color="success" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PerformanceChart
                title="Department-wise Average Performance"
                data={chartData}
                type="bar"
                xKey="name"
              />

              <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Department Analytics</h3>
                <div className="space-y-3">
                  {deptAnalytics.map((dept, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-900">{dept.department}</p>
                        <span className="text-sm font-bold text-primary-700">{dept.averageScore}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{dept.totalEmployees} Employees</span>
                        <span>{dept.totalSubmissions} Submissions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Employee ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{user.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.department?.name}</td>
                        <td className="px-4 py-3">
                          <span className="badge bg-primary-100 text-primary-800 border-primary-300 capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-green-100 text-green-800 border-green-300">
                            {user.employmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;