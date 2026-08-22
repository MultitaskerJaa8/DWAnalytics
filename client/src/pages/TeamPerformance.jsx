import { useState, useEffect } from 'react';
import { performanceAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateGrade } from '../utils/helpers';

const TeamPerformance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamStats, setTeamStats] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await performanceAPI.getTeamPerformance();
      setTeamStats(data.teamStats);
    } catch (error) {
      toast.error('Failed to load team performance');
    } finally {
      setLoading(false);
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
            <div className="mb-8">
              <h1 className="section-title">Team Performance</h1>
              <p className="section-subtitle">Overview of your team's performance metrics</p>
            </div>

            {teamStats.length === 0 ? (
              <div className="card text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No team members found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamStats.map((member) => {
                  const grade = calculateGrade(member.averageScore);
                  return (
                    <div key={member.employee._id} className="card hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{member.employee.name}</h3>
                          <p className="text-sm text-gray-600">{member.employee.employeeId}</p>
                          <p className="text-xs text-gray-500">{member.employee.designation}</p>
                        </div>
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: grade.color }}
                        >
                          {grade.grade}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Submissions</p>
                          <p className="text-xl font-bold text-gray-900">{member.totalSubmissions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Avg Score</p>
                          <p className="text-xl font-bold text-primary-700">{member.averageScore}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default TeamPerformance;