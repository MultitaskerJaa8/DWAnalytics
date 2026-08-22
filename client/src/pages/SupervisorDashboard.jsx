import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { performanceAPI, reportsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import ApprovalTable from '../components/ApprovalTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, ClipboardCheck, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ status: 'approved', supervisorRemarks: '', approvedScore: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        reportsAPI.getDashboardStats(),
        performanceAPI.getPendingApprovals(),
      ]);
      setStats(statsRes.data.stats);
      setPendingSubmissions(pendingRes.data.submissions);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (submission) => {
    setSelectedSubmission(submission);
    setReviewModal(true);
  };

  const submitReview = async () => {
    try {
      await performanceAPI.review(selectedSubmission._id, reviewData);
      toast.success(`Submission ${reviewData.status} successfully`);
      setReviewModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading supervisor dashboard..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            <div className="mb-8">
              <h1 className="section-title">Supervisor Dashboard</h1>
              <p className="section-subtitle">Manage your team's performance and approvals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatsCard title="Team Members" value={stats.teamMembers || 0} icon={Users} color="primary" />
              <StatsCard title="Pending Approvals" value={stats.pendingApprovals || 0} icon={AlertCircle} color="warning" />
              <StatsCard title="Approved This Month" value={stats.approvedThisMonth || 0} icon={ClipboardCheck} color="success" />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h2>
              <ApprovalTable submissions={pendingSubmissions} onReview={handleReview} loading={false} />
            </div>
          </div>

          {reviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Review Submission</h3>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm"><strong>Employee:</strong> {selectedSubmission.employee?.name}</p>
                  <p className="text-sm"><strong>KPI:</strong> {selectedSubmission.kpi?.title}</p>
                  <p className="text-sm"><strong>Task:</strong> {selectedSubmission.taskDetails}</p>
                  <p className="text-sm"><strong>Achieved:</strong> {selectedSubmission.achievedValue}/{selectedSubmission.kpi?.targetValue}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label-text">Decision *</label>
                    <select
                      value={reviewData.status}
                      onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                      className="input-field"
                    >
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>

                  {reviewData.status === 'approved' && (
                    <div>
                      <label className="label-text">Approved Score (0-100)</label>
                      <input
                        type="number"
                        value={reviewData.approvedScore}
                        onChange={(e) => setReviewData({ ...reviewData, approvedScore: e.target.value })}
                        className="input-field"
                        min="0"
                        max="100"
                      />
                    </div>
                  )}

                  <div>
                    <label className="label-text">Remarks</label>
                    <textarea
                      value={reviewData.supervisorRemarks}
                      onChange={(e) => setReviewData({ ...reviewData, supervisorRemarks: e.target.value })}
                      className="input-field min-h-[80px]"
                      placeholder="Add your feedback..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button onClick={submitReview} className="btn-primary flex-1">Submit Review</button>
                  <button onClick={() => setReviewModal(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default SupervisorDashboard;