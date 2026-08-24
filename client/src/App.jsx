import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import KPIManagement from './pages/KPIManagement';
import WorkSubmission from './pages/WorkSubmission';
import PerformanceReports from './pages/PerformanceReports';
import TeamPerformance from './pages/TeamPerformance';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading Digital Workforce Analytics..." />;
  }

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin-dashboard';
    if (user.role === 'supervisor') return '/supervisor-dashboard';
    return '/employee-dashboard';
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '10px', background: '#1e293b', color: '#fff', fontSize: '14px' },
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={['employee', 'supervisor', 'admin']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supervisor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
              <SupervisorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kpi-management"
          element={
            <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
              <KPIManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/work-submission"
          element={
            <ProtectedRoute allowedRoles={['employee', 'supervisor', 'admin']}>
              <WorkSubmission />
            </ProtectedRoute>
          }
        />

        <Route
          path="/performance-reports"
          element={
            <ProtectedRoute allowedRoles={['employee', 'supervisor', 'admin']}>
              <PerformanceReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team-performance"
          element={
            <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
              <TeamPerformance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['employee', 'supervisor', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to={getDashboardRoute()} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
