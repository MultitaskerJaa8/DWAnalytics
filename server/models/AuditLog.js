const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'REGISTER',
        'CREATE_KPI',
        'UPDATE_KPI',
        'DELETE_KPI',
        'SUBMIT_PERFORMANCE',
        'APPROVE_PERFORMANCE',
        'REJECT_PERFORMANCE',
        'UPDATE_ROLE',
        'UPDATE_USER',
        'DELETE_USER',
        'CREATE_DEPARTMENT',
        'UPDATE_DEPARTMENT',
        'GENERATE_REPORT',
      ],
    },
    module: {
      type: String,
      required: true,
      enum: ['Auth', 'KPI', 'Performance', 'User', 'Department', 'Report'],
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);