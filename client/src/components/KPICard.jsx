import { Target, Calendar, TrendingUp } from 'lucide-react';
import { formatDate, getAchievementPercent } from '../utils/helpers';

const KPICard = ({ kpi, onClick, showProgress = false, achievedValue = 0 }) => {
  const progress = showProgress ? getAchievementPercent(achievedValue, kpi.targetValue) : 0;

  return (
    <div
      onClick={onClick}
      className="card hover:shadow-xl cursor-pointer transition-all border-l-4 border-primary-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-700" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{kpi.title}</h3>
            <p className="text-xs text-gray-500">{kpi.category}</p>
          </div>
        </div>
        <span className="badge bg-primary-100 text-primary-800 border-primary-300">
          {kpi.weightage}% weightage
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{kpi.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Target</p>
          <p className="font-bold text-gray-900">
            {kpi.targetValue} {kpi.unit}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Cycle</p>
          <p className="font-semibold text-gray-700 text-sm">{kpi.evaluationCycle}</p>
        </div>
      </div>

      {showProgress && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-primary-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-600 to-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(kpi.startDate)} - {formatDate(kpi.endDate)}</span>
        </div>
        <span className="text-primary-700 font-semibold">View Details →</span>
      </div>
    </div>
  );
};

export default KPICard;