const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'KPI title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'KPI category is required'],
      enum: [
        'Service Delivery',
        'Task Completion',
        'Attendance Compliance',
        'Citizen Satisfaction',
        'Quality of Work',
        'Timeliness',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    targetValue: {
      type: Number,
      required: [true, 'Target value is required'],
    },
    unit: {
      type: String,
      default: 'tasks',
      trim: true,
    },
    weightage: {
      type: Number,
      required: [true, 'Weightage is required'],
      min: 1,
      max: 100,
    },
    evaluationCycle: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Annual'],
      default: 'Monthly',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KPI', kpiSchema);