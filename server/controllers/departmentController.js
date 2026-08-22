const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');

// @desc    Create department
// @route   POST /api/department
const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, head } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const exists = await Department.findOne({ $or: [{ name }, { code: code.toUpperCase() }] });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Department with this name or code already exists' });
    }

    const department = await Department.create({ name, code, description, head: head || null });

    await AuditLog.create({
      user: req.user._id, action: 'CREATE_DEPARTMENT', module: 'Department',
      details: `Department created: ${department.name}`, ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Department created successfully', department });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all departments
// @route   GET /api/department
const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate('head', 'name employeeId designation').sort({ name: 1 });
    res.status(200).json({ success: true, count: departments.length, departments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department
// @route   GET /api/department/:id
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

// @desc    Update department
// @route   PUT /api/department/:id
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

    res.status(200).json({ success: true, message: 'Department updated successfully', department });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/department/:id
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await department.deleteOne();
    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment };