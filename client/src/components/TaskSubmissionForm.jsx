import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCurrentMonthYear } from '../utils/helpers';

const TaskSubmissionForm = ({ kpi, onSubmit, onCancel }) => {
  const { month, year } = getCurrentMonthYear();
  const [formData, setFormData] = useState({
    taskDetails: '', achievedValue: '', month, year,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.taskDetails.trim() || !formData.achievedValue) {
      toast.error('Please fill all required fields');
      return;
    }

    const submitData = new FormData();
    submitData.append('kpi', kpi._id);
    submitData.append('taskDetails', formData.taskDetails);
    submitData.append('achievedValue', formData.achievedValue);
    submitData.append('month', formData.month);
    submitData.append('year', formData.year);
    files.forEach((file) => submitData.append('evidenceDocuments', file));

    setLoading(true);
    await onSubmit(submitData);
    setLoading(false);
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Submit Work for KPI</h3>
      <p className="text-sm text-gray-600 mb-6">{kpi.title} ({kpi.category})</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-text">Task Details *</label>
          <textarea
            value={formData.taskDetails}
            onChange={(e) => setFormData({ ...formData, taskDetails: e.target.value })}
            className="input-field min-h-[100px]"
            placeholder="Describe the work completed, milestones achieved, etc."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label-text">Achieved Value *</label>
            <input
              type="number"
              value={formData.achievedValue}
              onChange={(e) => setFormData({ ...formData, achievedValue: e.target.value })}
              className="input-field"
              placeholder={`e.g., ${kpi.targetValue}`}
              required
            />
          </div>
          <div>
            <label className="label-text">Month *</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
              className="input-field"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Year *</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Evidence Documents (max 5 files)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="input-field"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          />
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-600 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Submitting...' : 'Submit Work'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskSubmissionForm;