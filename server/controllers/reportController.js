const Performance = require('../models/Performance');
const KPI = require('../models/KPI');
const User = require('../models/User');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// @desc    Role-based dashboard statistics
// @route   GET /api/reports/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const totalEmployees = await User.countDocuments({ role: { $ne: 'admin' } });
      const totalDepartments = await Department.countDocuments();
      const totalKPIs = await KPI.countDocuments({ status: 'active' });
      const pendingApprovals = await Performance.countDocuments({ status: 'submitted' });
      const approvedThisMonth = await Performance.countDocuments({
        status: 'approved',
        'evaluationPeriod.month': new Date().getMonth() + 1,
        'evaluationPeriod.year': new Date().getFullYear(),
      });

      return res.status(200).json({
        success: true,
        stats: { totalEmployees, totalDepartments, totalKPIs, pendingApprovals, approvedThisMonth },
      });
    }

    if (req.user.role === 'supervisor') {
      const teamIds = await User.find({ reportingManager: req.user._id }).distinct('_id');
      const teamMembers = teamIds.length;
      const pendingApprovals = await Performance.countDocuments({ employee: { $in: teamIds }, status: 'submitted' });

      return res.status(200).json({ success: true, stats: { teamMembers, pendingApprovals } });
    }

    const myKPIs = await KPI.countDocuments({ department: req.user.department, status: 'active' });
    const mySubmissions = await Performance.countDocuments({ employee: req.user._id });
    const approved = await Performance.find({ employee: req.user._id, status: 'approved' });
    const avgScore = approved.length
      ? Math.round(approved.reduce((sum, p) => sum + (p.finalScore || 0), 0) / approved.length)
      : 0;
    const pendingReview = await Performance.countDocuments({ employee: req.user._id, status: 'submitted' });

    res.status(200).json({ success: true, stats: { myKPIs, mySubmissions, avgScore, pendingReview } });
  } catch (error) {
    next(error);
  }
};

// @desc    Department-wise comparison analytics
// @route   GET /api/reports/department-analytics
const getDepartmentAnalytics = async (req, res, next) => {
  try {
    const departments = await Department.find();
    const analytics = [];

    for (const dept of departments) {
      const employees = await User.find({ department: dept._id }).distinct('_id');
      const performances = await Performance.find({ employee: { $in: employees }, status: 'approved' });
      const avgScore = performances.length
        ? Math.round(performances.reduce((sum, p) => sum + (p.finalScore || 0), 0) / performances.length)
        : 0;

      analytics.push({
        department: dept.name, code: dept.code,
        totalEmployees: employees.length, totalSubmissions: performances.length, averageScore: avgScore,
      });
    }

    res.status(200).json({ success: true, analytics });
  } catch (error) {
    next(error);
  }
};

// @desc    Export PDF report
// @route   GET /api/reports/export/pdf
const exportPDFReport = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    const filter = { status: 'approved' };
    if (employeeId) filter.employee = employeeId;
    else if (req.user.role === 'employee') filter.employee = req.user._id;

    const performances = await Performance.find(filter)
      .populate('employee', 'name employeeId designation')
      .populate('kpi', 'title category weightage')
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=performance-report.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Digital Workforce Performance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    performances.forEach((p, index) => {
      doc.fontSize(11)
        .text(`${index + 1}. Employee: ${p.employee?.name} (${p.employee?.employeeId})`)
        .text(`   KPI: ${p.kpi?.title} | Category: ${p.kpi?.category}`)
        .text(`   Task: ${p.taskDetails}`)
        .text(`   Approved Score: ${p.approvedScore} | Final Score: ${p.finalScore}`)
        .text(`   Period: ${p.evaluationPeriod.month}/${p.evaluationPeriod.year}`)
        .moveDown();
    });

    await AuditLog.create({
      user: req.user._id, action: 'GENERATE_REPORT', module: 'Report',
      details: 'PDF performance report generated', ipAddress: req.ip,
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Export Excel report
// @route   GET /api/reports/export/excel
const exportExcelReport = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    const filter = { status: 'approved' };
    if (employeeId) filter.employee = employeeId;
    else if (req.user.role === 'employee') filter.employee = req.user._id;

    const performances = await Performance.find(filter)
      .populate('employee', 'name employeeId designation')
      .populate('kpi', 'title category weightage')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Performance Report');

    sheet.columns = [
      { header: 'Employee Name', key: 'name', width: 22 },
      { header: 'Employee ID', key: 'empId', width: 15 },
      { header: 'KPI Title', key: 'kpi', width: 25 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Task Details', key: 'task', width: 35 },
      { header: 'Approved Score', key: 'approvedScore', width: 15 },
      { header: 'Final Score', key: 'finalScore', width: 12 },
      { header: 'Period', key: 'period', width: 12 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };

    performances.forEach((p) => {
      sheet.addRow({
        name: p.employee?.name, empId: p.employee?.employeeId, kpi: p.kpi?.title,
        category: p.kpi?.category, task: p.taskDetails, approvedScore: p.approvedScore,
        finalScore: p.finalScore, period: `${p.evaluationPeriod.month}/${p.evaluationPeriod.year}`,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=performance-report.xlsx');

    await AuditLog.create({
      user: req.user._id, action: 'GENERATE_REPORT', module: 'Report',
      details: 'Excel performance report generated', ipAddress: req.ip,
    });

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getDepartmentAnalytics, exportPDFReport, exportExcelReport };