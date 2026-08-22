import { useState, useEffect } from 'react';
import { performanceAPI, reportsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import PerformanceChart from '../components/PerformanceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, calculateGrade, getMonthName } from '../utils/helpers';
import { downloadBlob } from '../utils/helpers';

const PerformanceReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await performanceAPI.getHistory();
      setHistory(data.history);
      if (data.history.length > 0) {
        const avg = Math.round(
          data.history.reduce((sum, p) => sum + (p.finalScore || 0), 0) / data.history.length
        );
        setAvgScore(avg);
      }
    } catch (error) {
      toast.error('Failed to load performance history');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const { data } = await reportsAPI.exportPDF();
      downloadBlob(data, `performance-report-${Date.now()}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      const { data } = await reportsAPI.exportExcel();
      downloadBlob(data, `performance-report-${Date.now()}.xlsx`);
      toast.success('Excel downloaded successfully');
    } catch (error) {
      toast.error('Failed to export Excel');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const grade = calculateGrade(avgScore);

  const chartData = history.slice(0, 6).reverse().map((p) => ({
    name: `${getMonthName(p.evaluationPeriod.month).substring(0, 3)}`,
    value: p.finalScore || 0,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="section-title">Performance Reports</h1>
                <p className="section-subtitle">View your evaluation history and analytics</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={handleExportPDF} className="btn-secondary flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button onClick={handleExportExcel} className="btn-primary flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Excel</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="card text-center">
                <p className="text-sm text-gray-600 mb-3">Overall Performance Grade</p>
                <div className="grade-circle mx-auto" style={{ backgroundColor: grade.color }}>
                  <span className="text-white">{grade.grade}</span>
                </div>
                <p className="mt-4 font-semibold text-gray-800">{grade.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{avgScore}%</p>
              </div>

              <div className="lg:col-span-2">
                <PerformanceChart
                  title="Performance Trend (Last 6 Months)"
                  data={chartData}
                  type="line"
                />
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Complete Performance History</h3>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No performance records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">KPI</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Period</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Weightage</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.map((perf) => (
                        <tr key={perf._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{perf.kpi?.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{perf.kpi?.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {getMonthName(perf.evaluationPeriod?.month)}/{perf.evaluationPeriod?.year}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{perf.kpi?.weightage}%</td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-primary-700 text-lg">{perf.finalScore}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                            {perf.supervisorRemarks || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default PerformanceReports;