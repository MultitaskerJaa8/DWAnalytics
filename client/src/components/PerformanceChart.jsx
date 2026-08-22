import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CHART_COLORS } from '../utils/constants';

const PerformanceChart = ({ data, type = 'bar', title, dataKey = 'value', xKey = 'name' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <p className="text-center text-gray-500 py-8">No data available for chart</p>
      </div>
    );
  }

  const ChartComponent = type === 'line' ? LineChart : BarChart;

  return (
    <div className="card">
      {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {type === 'line' ? (
            <Line type="monotone" dataKey={dataKey} stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ r: 5 }} />
          ) : (
            <Bar dataKey={dataKey} fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;