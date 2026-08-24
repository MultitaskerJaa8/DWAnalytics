const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, department, designation, role, phone, reportingManager } = req.body;

    if (!employeeId || !name || !email || !password || !department || !designation) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return res.status(400).json({ success: false, message: 'Invalid department' });
    }

    const user = await User.create({
      employeeId, name, email, password, department, designation,
      role: role || 'employee', phone, reportingManager: reportingManager || null,
    });

    await Department.findByIdAndUpdate(department, { $inc: { totalEmployees: 1 } });

    await AuditLog.create({
      user: user._id, action: 'REGISTER', module: 'Auth',
      details: `New user registered: ${user.name}`, ipAddress: req.ip,
    });

    const populatedUser = await User.findById(user._id).populate('department', 'name code');

    res.status(201).json({
      success: true, message: 'Registration successful',
      token: generateToken(user._id), user: populatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('department', 'name code');

    if (!user || !(await user.comparePassword(password))) {
      await AuditLog.create({
        action: 'LOGIN', module: 'Auth', details: `Failed login: ${email}`,
        ipAddress: req.ip, status: 'failure',
      });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.employmentStatus === 'terminated' || user.employmentStatus === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    user.lastLogin = new Date();
    await user.save();

    await AuditLog.create({
      user: user._id, action: 'LOGIN', module: 'Auth',
      details: `User logged in: ${user.name}`, ipAddress: req.ip,
    });

    res.status(200).json({
      success: true, message: 'Login successful', token: generateToken(user._id), user,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('department', 'name code')
      .populate('reportingManager', 'name employeeId designation');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both passwords' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await AuditLog.create({
      user: req.user._id, action: 'LOGOUT', module: 'Auth',
      details: `User logged out: ${req.user.name}`, ipAddress: req.ip,
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, changePassword, logoutUser };
