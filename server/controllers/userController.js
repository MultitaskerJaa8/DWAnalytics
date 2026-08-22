const User = require('../models/User');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');

// @desc    Get all users with filters
// @route   GET /api/user
const getAllUsers = async (req, res, next) => {
  try {
    const { department, role, employmentStatus } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (role) filter.role = role;
    if (employmentStatus) filter.employmentStatus = employmentStatus;

    const users = await User.find(filter)
      .populate('department', 'name code')
      .populate('reportingManager', 'name employeeId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/user/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('department', 'name code')
      .populate('reportingManager', 'name employeeId designation');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lightweight list for dropdowns (supervisor/employee assignment)
// @route   GET /api/user/list/supervisors-employees
const getSupervisorsAndEmployees = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $in: ['employee', 'supervisor'] } })
      .select('name employeeId designation role department')
      .populate('department', 'name');
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/user/:id
const updateUser = async (req, res, next) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('department', 'name code');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await AuditLog.create({
      user: req.user._id, action: 'UPDATE_USER', module: 'User',
      details: `User updated: ${user.name}`, ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/user/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['employee', 'supervisor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await AuditLog.create({
      user: req.user._id, action: 'UPDATE_ROLE', module: 'User',
      details: `Role updated to '${role}' for user: ${user.name}`, ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: 'User role updated successfully', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/user/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await Department.findByIdAndUpdate(user.department, { $inc: { totalEmployees: -1 } });
    await user.deleteOne();

    await AuditLog.create({
      user: req.user._id, action: 'DELETE_USER', module: 'User',
      details: `User deleted: ${user.name}`, ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, getSupervisorsAndEmployees, updateUser, updateUserRole, deleteUser };