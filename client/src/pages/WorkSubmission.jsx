import { useState, useEffect } from 'react';
import { kpiAPI, performanceAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import TaskSubmissionForm from '../components/TaskSubmissionForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, getMonthName } from '../utils/helpers';
import { STATUS_COLORS } from '../utils/constants';

const WorkSubmission = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myKPIs, setMyKPIs] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [selectedKPI, setSelectedKPI] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpisRes, submissionsRes] = await Promise.all([
        kpiAPI.getMyKPIs(),
        performanceAPI.getMySubmissions(),
      ]);
      setMyKPIs(kpisRes.data.kpis);
      setMySubmissions(submissionsRes.data.submissions);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await performanceAPI.submit(formData);
      toast.success('Work submitted successfully!');
      setSelectedKPI(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            {!selectedKPI ? (
              <>
                <div className="mb-8">
                  <h1 className="section-title">Work Submission</h1>
                  <p className="section-subtitle">Submit your work logs and track submissions</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Select KPI to Submit Work</h2>
                  <div className="kpi-grid">
                    {myKPIs.map((kpi) => (
                      <div
                        key={kpi._id}
                        onClick={() => setSelectedKPI(kpi)}
                        className="card cursor-pointer hover:shadow-xl transition-all border-l-4 border-primary-600"
                      >
                        <h3 className="font-bold text-gray-900 mb-2">{kpi.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{kpi.category}</p>
                        <button className="btn-primary w-full">Submit Work →</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">My Recent Submissions</h2>
                  {mySubmissions.length === 0 ? (
                    <div className="card text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No submissions yet. Submit your first work log above!</p>
                    </div>
                  ) : (
                    <div className="card overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">KPI</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Task</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Achieved</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Period</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Score</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mySubmissions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{sub.kpi?.title}</td>
                              <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{sub.taskDetails}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{sub.achievedValue}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {getMonthName(sub.evaluationPeriod?.month)}/{sub.evaluationPeriod?.year}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`badge ${STATUS_COLORS[sub.status]}`}>{sub.status}</span>
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-primary-700">
                                {sub.finalScore || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <TaskSubmissionForm
                kpi={selectedKPI}
                onSubmit={handleSubmit}
                onCancel={() => setSelectedKPI(null)}
              />
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default WorkSubmission;