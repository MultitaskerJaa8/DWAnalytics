const express = require('express');
const router = express.Router();
const { getDashboardStats, getDepartmentAnalytics, exportPDFReport, exportExcelReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.get('/dashboard-stats', getDashboardStats);
router.get('/department-analytics', authorize('admin'), getDepartmentAnalytics);
router.get('/export/pdf', exportPDFReport);
router.get('/export/excel', exportExcelReport);

module.exports = router;
