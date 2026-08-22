export const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  EMPLOYEE: 'employee',
};

export const KPI_CATEGORIES = [
  'Service Delivery',
  'Task Completion',
  'Attendance Compliance',
  'Citizen Satisfaction',
  'Quality of Work',
  'Timeliness',
  'Other',
];

export const EVALUATION_CYCLES = ['Monthly', 'Quarterly', 'Annual'];

export const SUBMISSION_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under-review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const STATUS_COLORS = {
  submitted: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'under-review': 'bg-blue-100 text-blue-800 border-blue-300',
  approved: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
  active: 'bg-green-100 text-green-800 border-green-300',
  inactive: 'bg-gray-100 text-gray-800 border-gray-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const GRADE_SCALE = [
  { min: 90, grade: 'A+', label: 'Outstanding', color: '#059669' },
  { min: 80, grade: 'A', label: 'Excellent', color: '#10b981' },
  { min: 70, grade: 'B+', label: 'Very Good', color: '#3b82f6' },
  { min: 60, grade: 'B', label: 'Good', color: '#6366f1' },
  { min: 50, grade: 'C', label: 'Satisfactory', color: '#f59e0b' },
  { min: 0, grade: 'D', label: 'Needs Improvement', color: '#dc2626' },
];

export const CHART_COLORS = ['#1e40af', '#3b82f6', '#fbbf24', '#059669', '#dc2626', '#8b5cf6', '#ec4899'];