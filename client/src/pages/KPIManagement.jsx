import { useState, useEffect } from 'react';
import { kpiAPI, departmentAPI, userAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import KPICard from '../components/KPICard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { KPI_CATEGORIES, EVALUATION_CYCLES } from '../utils/constants';

const KPIManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Task Completion', description: '', department: '',
    targetValue: '', unit: 'tasks', weightage: '', evaluationCycle: 'Monthly',
    startDate: '', endDate: '', assignedTo: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpisRes, deptsRes, usersRes] = await Promise.all([
        kpiAPI.getAll(),
        departmentAPI.getAll(),
        userAPI.getSupervisorsAndEmployees(),
      ]);
      setKpis(kpisRes.data.kpis);
      setDepartments(deptsRes.data.departments);
      setUsers(usersRes.data.users);
    } catch (error) {
      toast.error('Failed to load KPIs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await kpiAPI.create(formData);
      toast.success('KPI created successfully');
      setShowModal(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create KPI');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', category: 'Task Completion', description: '', department: '',
      targetValue: '', unit: 'tasks', weightage: '', evaluationCycle: 'Monthly',
      startDate: '', endDate: '', assignedTo: [],
    });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="section-title">KPI Management</h1>
                <p className="section-subtitle">Create and manage Key Performance Indicators</p>
              </div>
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create KPI</span>
              </button>
            </div>

            {kpis.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">No KPIs found. Create your first KPI to get started.</p>
              </div>
            ) : (
              <div className="kpi-grid">
                {kpis.map((kpi) => (
                  <KPICard key={kpi._id} kpi={kpi} onClick={() => {}} />
                ))}
              </div>
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Create New KPI</h3>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="label-text">KPI Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field select-field"
                        required
                      >
                        {KPI_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Department *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="input-field select-field"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field min-h-[80px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label-text">Target Value *</label>
                      <input
                        type="number"
                        value={formData.targetValue}
                        onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-text">Unit</label>
                      <input
                        type="text"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label-text">Weightage (%) *</label>
                      <input
                        type="number"
                        value={formData.weightage}
                        onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                        className="input-field"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label-text">Evaluation Cycle *</label>
                      <select
                        value={formData.evaluationCycle}
                        onChange={(e) => setFormData({ ...formData, evaluationCycle: e.target.value })}
                        className="input-field select-field"
                      >
                        {EVALUATION_CYCLES.map((cycle) => (
                          <option key={cycle} value={cycle}>{cycle}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Start Date *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-text">End Date *</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="btn-primary flex-1">Create KPI</button>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default KPIManagement;