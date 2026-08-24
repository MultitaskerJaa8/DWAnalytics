const Performance = require('../models/Performance');
const KPI = require('../models/KPI');
const User = require('../models/User');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

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
        .text(`   KPI: ${p.kpi?.title}`)
        .text(`   Score: ${p.finalScore}`)
        .moveDown();
    });

    await AuditLog.create({
      user: req.user._id, action: 'GENERATE_REPORT', module: 'Report',
      details: 'PDF report generated', ipAddress: req.ip,
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

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
      { header: 'Score', key: 'score', width: 12 },
    ];

    performances.forEach((p) => {
      sheet.addRow({
        name: p.employee?.name, empId: p.employee?.employeeId, kpi: p.kpi?.title,
        category: p.kpi?.category, score: p.finalScore,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=performance-report.xlsx');

    await AuditLog.create({
      user: req.user._id, action: 'GENERATE_REPORT', module: 'Report',
      details: 'Excel report generated', ipAddress: req.ip,
    });

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getDepartmentAnalytics, exportPDFReport, exportExcelReport };
