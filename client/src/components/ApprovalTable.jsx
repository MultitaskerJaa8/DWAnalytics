import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatDate, getMonthName } from '../utils/helpers';
import { STATUS_COLORS } from '../utils/constants';

const ApprovalTable = ({ submissions, onReview, loading }) => {
  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading submissions...</p>;
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No pending submissions found</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Employee</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">KPI</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Task Details</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Achieved</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Period</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((sub) => (
            <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">{sub.employee?.name}</p>
                <p className="text-xs text-gray-500">{sub.employee?.employeeId}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-800">{sub.kpi?.title}</p>
                <p className="text-xs text-gray-500">{sub.kpi?.category}</p>
              </td>
              <td className="px-4 py-3 max-w-xs">
                <p className="text-sm text-gray-700 truncate">{sub.taskDetails}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  {sub.achievedValue} / {sub.kpi?.targetValue}
                </p>
                <p className="text-xs text-gray-500">{sub.kpi?.unit}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {getMonthName(sub.evaluationPeriod?.month)}/{sub.evaluationPeriod?.year}
              </td>
              <td className="px-4 py-3">
                <span className={`badge ${STATUS_COLORS[sub.status]}`}>{sub.status}</span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onReview(sub)}
                  className="text-primary-700 hover:text-primary-900 font-medium text-sm flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Review</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalTable;