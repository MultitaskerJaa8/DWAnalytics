import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Target, FileText, Users, TrendingUp, UserCog, X, FolderKanban, ClipboardCheck,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const employeeLinks = [
    { path: '/employee-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/work-submission', label: 'Submit Work', icon: ClipboardCheck },
    { path: '/performance-reports', label: 'My Performance', icon: TrendingUp },
    { path: '/profile', label: 'Profile', icon: UserCog },
  ];

  const supervisorLinks = [
    { path: '/supervisor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/team-performance', label: 'Team Performance', icon: Users },
    { path: '/kpi-management', label: 'KPI Management', icon: Target },
    { path: '/work-submission', label: 'Submit Work', icon: ClipboardCheck },
    { path: '/performance-reports', label: 'Reports', icon: FileText },
    { path: '/profile', label: 'Profile', icon: UserCog },
  ];

  const adminLinks = [
    { path: '/admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { path: '/kpi-management', label: 'KPI Management', icon: Target },
    { path: '/team-performance', label: 'Department Analytics', icon: TrendingUp },
    { path: '/performance-reports', label: 'Reports', icon: FileText },
    { path: '/profile', label: 'System Settings', icon: FolderKanban },
  ];

  const getLinks = () => {
    if (user?.role === 'admin') return adminLinks;
    if (user?.role === 'supervisor') return supervisorLinks;
    return employeeLinks;
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center lg:hidden">
          <h2 className="font-bold text-gray-800">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-800 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg">
            <p className="text-xs font-semibold text-primary-900 mb-1">Need Help?</p>
            <p className="text-xs text-gray-600">Contact your department admin or IT support.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;