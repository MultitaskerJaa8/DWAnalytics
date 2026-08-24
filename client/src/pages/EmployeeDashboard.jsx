import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { kpiAPI, reportsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatsCard from '../components/StatsCard';
import KPICard from '../components/KPICard';
import PerformanceChart from '../components/PerformanceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [myKPIs, setMyKPIs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, kpisRes] = await Promise.all([
        reportsAPI.getDashboardStats(),
        kpiAPI.getMyKPIs(),
      ]);
      setStats(statsRes.data.stats);
      setMyKPIs(kpisRes.data.kpis);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading your dashboard..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
