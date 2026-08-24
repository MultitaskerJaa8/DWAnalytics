const KPI = require('../models/KPI');
const AuditLog = require('../models/AuditLog');

const createKPI = async (req, res, next) => {
  try {
    const { title, category, description, department, assignedTo, targetValue, unit, weightage, evaluationCycle, startDate, endDate } = req.body;

    if (!title || !category || !description || !department || !targetValue || !weightage || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const kpi = await KPI.create({
      title, category, description, department, assignedTo: assignedTo || [],
      targetValue, unit, weightage, evaluationCycle, startDate, endDate, createdBy: req.user._id,
    });

    await AuditLog.create({
      user: req.user._id, action: 'CREATE_KPI', module: 'KPI',
      details: `KPI created: ${kpi.title}`, ipAddress: req.ip,
    });

    const populatedKPI = await KPI.findById(kpi._id)
      .populate('department', 'name code')
      .populate('assignedTo', 'name employeeId')
      .populate('createdBy', 'name');

    res.status(201).json({ success: true, message: 'KPI created', kpi: populatedKPI });
  } catch (error) {
    next(error);
  }
};

const getAllKPIs = async (req, res, next) => {
  try {
    const { department, status, category, evaluationCycle } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (evaluationCycle) filter.evaluationCycle = evaluationCycle;

    const kpis = await KPI.find(filter)
      .populate('department', 'name code')
      .populate('assignedTo', 'name employeeId designation')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: kpis.length, kpis });
  } catch (error) {
    next(error);
  }
};

const getMyKPIs = async (req, res, next) => {
  try {
    const kpis = await KPI.find({
      department: req.user.department,
      status: 'active',
      $or: [{ assignedTo: req.user._id }, { assignedTo: { $size: 0 } }],
    })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: kpis.length, kpis });
  } catch (error) {
    next(error);
  }
};

const getKPIById = async (req, res, next) => {
  try {
    const kpi = await KPI.findById(req.params.id)
      .populate('department', 'name code')
      .populate('assignedTo', 'name employeeId designation')
      .populate('createdBy', 'name');

    if (!kpi) {
      return res.status(404).json({ success: false, message: 'KPI not found' });
    }

    res.status(200).json({ success: true, kpi });
  } catch (error) {
    next(error);
  }
};

const updateKPI = async (req, res, next) => {
  try {
    const existing = await KPI.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'KPI not found' });
    }

    const kpi = await KPI.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('department', 'name code')
      .populate('assignedTo', 'name employeeId');

    await AuditLog.create({
      user: req.user._id, action: 'UPDATE_KPI', module: 'KPI',
      details: `KPI updated: ${kpi.title}`, ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: 'KPI updated', kpi });
  } catch (error) {
    next(error);
  }
};

const deleteKPI = async (req, res, next) => {
  try {
    const kpi = await KPI.findById(req.params.id);
    if (!kpi) {
      return res.status(404).json({ success: false, message: 'KPI not found' });
    }

    await kpi.deleteOne();

    await AuditLog.create({
      user: req.user._id, action: 'DELETE_KPI', module: 'KPI',
      details: `KPI deleted: ${kpi.title}`, ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: 'KPI deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createKPI, getAllKPIs, getMyKPIs, getKPIById, updateKPI, deleteKPI };
