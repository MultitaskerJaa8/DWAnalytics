const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');

const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, head } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const exists = await Department.findOne({ $or: [{ name }, { code: code.toUpperCase() }] });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Department already exists' });
    }

    const department = await Department.create({ name, code, description, head: head || null });

    await AuditLog.create({
      user: req.user._id, action: 'CREATE_DEPARTMENT', module: 'Department',
      details: `Department created: ${department.name}`, ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Department created', department });
  } catch (error) {
    next(error);
  }
};

const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate('head', 'name employeeId designation').sort({ name: 1 });
    res.status(200).json({ success: true, count: departments.length, departments });
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id).populate('head', 'name employeeId');
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await AuditLog.create({
      user: req.user._id, action: 'UPDATE_DEPARTMENT', module: 'Department',
      details: `Department updated: ${department.name}`, ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: 'Department updated', department });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await department.deleteOne();
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment };
