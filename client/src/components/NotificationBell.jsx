import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { performanceAPI } from '../utils/api';

const NotificationBell = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const { data } = await performanceAPI.getPendingApprovals();
        setCount(data.count || 0);
      } catch (error) {
        // Silently fail
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Bell className="w-5 h-5 text-gray-600" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;