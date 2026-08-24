import { GRADE_SCALE, MONTHS } from './constants';

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getMonthName = (monthNumber) => {
  return MONTHS[monthNumber - 1] || '-';
};

export const getCurrentMonthYear = () => {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
};

export const calculateGrade = (score) => {
  const found = GRADE_SCALE.find((g) => score >= g.min);
  return found || GRADE_SCALE[GRADE_SCALE.length - 1];
};

export const getAchievementPercent = (achieved, target) => {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((achieved / target) * 100), 100);
};

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const downloadBlob = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const getFileIcon = (filename) => {
  if (!filename) return '📄';
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️';
  if (ext === 'pdf') return '📕';
  if (['doc', 'docx'].includes(ext)) return '📝';
  return '📄';
};
