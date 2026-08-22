import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { kpiAPI, reportsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import KPICard from '../components/KPICard';
import PerformanceChart from '../components/PerformanceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [myKPIs, setMyKPIs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, kpisRes] = await Promise.all([
        reportsAPI.getDashboardStats(),
        kpiAPI.getMyKPIs(),
      ]);
      setStats(statsRes.data.stats);
      setMyKPIs(kpisRes.data.kpis);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading your dashboard..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            <div className="mb-8">
              <h1 className="section-title">Welcome back, {user?.name}! 👋</h1>
              <p className="section-subtitle">
                {user?.designation} | {user?.department?.name} ({user?.employeeId})
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="My Active KPIs"
                value={stats.myKPIs || 0}
                icon={Target}
                color="primary"
              />
              <StatsCard
                title="Total Submissions"
                value={stats.mySubmissions || 0}
                icon={CheckCircle}
                color="success"
              />
              <StatsCard
                title="Average Score"
                value={`${stats.avgScore || 0}%`}
                icon={TrendingUp}
                color="info"
              />
              <StatsCard
                title="Pending Review"
                value={stats.pendingReview || 0}
                icon={Clock}
                color="warning"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">My Assigned KPIs</h2>
              {myKPIs.length === 0 ? (
                <div className="card text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No KPIs assigned yet. Contact your supervisor.</p>
                </div>
              ) : (
                <div className="kpi-grid">
                  {myKPIs.map((kpi) => (
                    <KPICard key={kpi._id} kpi={kpi} onClick={() => {}} />
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart
                title="Monthly Performance Trend"
                data={[
                  { name: 'Jan', value: 65 },
                  { name: 'Feb', value: 72 },
                  { name: 'Mar', value: 78 },
                  { name: 'Apr', value: 85 },
                  { name: 'May', value: 88 },
                ]}
                type="line"
              />
              <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/work-submission" className="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                    <p className="font-semibold text-primary-900">Submit New Work Log</p>
                    <p className="text-sm text-gray-600">Record your completed tasks and achievements</p>
                  </a>
                  <a href="/performance-reports" className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <p className="font-semibold text-green-900">View Performance Reports</p>
                    <p className="text-sm text-gray-600">Check your evaluation history and scores</p>
                  </a>
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

export default EmployeeDashboard;