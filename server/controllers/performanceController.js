const Performance = require('../models/Performance');
const KPI = require('../models/KPI');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @desc    Submit work log / performance entry
// @route   POST /api/performance/submit
const submitWork = async (req, res, next) => {
  try {
    const { kpi, taskDetails, achievedValue, month, year } = req.body;

    if (!kpi || !taskDetails || achievedValue === undefined || !month || !year) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const kpiDoc = await KPI.findById(kpi);
    if (!kpiDoc) {
      return res.status(404).json({ success: false, message: 'KPI not found' });
    }

    const evidenceDocuments = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          url: `/uploads/${file.filename}`,
        }))
      : [];

    const performance = await Performance.create({
      employee: req.user._id, kpi, taskDetails, achievedValue, evidenceDocuments,
      completionStatus: 'completed', evaluationPeriod: { month, year },
    });

    await AuditLog.create({
      user: req.user._id, action: 'SUBMIT_PERFORMANCE', module: 'Performance',
      details: `Work submitted for KPI: ${kpiDoc.title}`, ipAddress: req.ip,
    });

    const populated = await Performance.findById(performance._id)
      .populate('kpi', 'title targetValue weightage unit')
      .populate('employee', 'name employeeId');

    res.status(201).json({ success: true, message: 'Work submitted successfully', performance: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in employee's submissions
// @route   GET /api/performance/my-submissions
const getMySubmissions = async (req, res, next) => {
  try {
    const { status, month, year } = req.query;
    const filter = { employee: req.user._id };
    if (status) filter.status = status;
    if (month) filter['evaluationPeriod.month'] = Number(month);
    if (year) filter['evaluationPeriod.year'] = Number(year);

    const submissions = await Performance.find(filter)
      .populate('kpi', 'title category targetValue weightage unit')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending approvals for supervisor/admin
// @route   GET /api/performance/pending-approvals
const getPendingApprovals = async (req, res, next) => {
  try {
    const filter = { status: 'submitted' };

    if (req.user.role === 'supervisor') {
      const teamIds = await User.find({ reportingManager: req.user._id }).distinct('_id');
      filter.employee = { $in: teamIds };
    }

    const submissions = await Performance.find(filter)
      .populate('kpi', 'title targetValue weightage unit category')
      .populate('employee', 'name employeeId designation department')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a submission (with score calculation)
// @route   PUT /api/performance/:id/review
const reviewSubmission = async (req, res, next) => {
  try {
    const { status, supervisorRemarks, approvedScore } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const performance = await Performance.findById(req.params.id).populate('kpi');
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance submission not found' });
    }

    performance.status = status;
    performance.supervisorRemarks = supervisorRemarks || '';
    performance.reviewedBy = req.user._id;
    performance.reviewedAt = new Date();

    if (status === 'approved') {
      const achievementPercent = Math.min((performance.achievedValue / performance.kpi.targetValue) * 100, 100);
      performance.approvedScore = approvedScore !== undefined ? approvedScore : Math.round(achievementPercent);
      performance.finalScore = Math.round((performance.approvedScore * performance.kpi.weightage) / 100);
    }

    await performance.save();

    await AuditLog.create({
      user: req.user._id,
      action: status === 'approved' ? 'APPROVE_PERFORMANCE' : 'REJECT_PERFORMANCE',
      module: 'Performance',
      details: `Submission ${status} for KPI: ${performance.kpi.title}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: `Submission ${status} successfully`, performance });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team performance overview (supervisor)
// @route   GET /api/performance/team
const getTeamPerformance = async (req, res, next) => {
  try {
    const teamMembers = await User.find({ reportingManager: req.user._id }).select('_id name employeeId designation');
    const teamIds = teamMembers.map((m) => m._id);

    const performances = await Performance.find({ employee: { $in: teamIds }, status: 'approved' })
      .populate('kpi', 'title weightage')
      .populate('employee', 'name employeeId designation');

    const teamStats = teamMembers.map((member) => {
      const memberPerf = performances.filter((p) => p.employee._id.toString() === member._id.toString());
      const avgScore = memberPerf.length
        ? Math.round(memberPerf.reduce((sum, p) => sum + (p.finalScore || 0), 0) / memberPerf.length)
        : 0;
      return { employee: member, totalSubmissions: memberPerf.length, averageScore: avgScore };
    });

    res.status(200).json({ success: true, teamStats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance history for an employee
// @route   GET /api/performance/history/:employeeId?
const getPerformanceHistory = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId || req.user._id;

    const history = await Performance.find({ employee: employeeId, status: 'approved' })
      .populate('kpi', 'title category evaluationCycle weightage')
      .sort({ 'evaluationPeriod.year': -1, 'evaluationPeriod.month': -1 });

    res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitWork, getMySubmissions, getPendingApprovals, reviewSubmission, getTeamPerformance, getPerformanceHistory,
};