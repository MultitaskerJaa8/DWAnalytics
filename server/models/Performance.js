const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kpi: { type: mongoose.Schema.Types.ObjectId, ref: 'KPI', required: true },
    taskDetails: { type: String, required: true, trim: true },
    achievedValue: { type: Number, required: true, default: 0 },
    evidenceDocuments: [
      {
        filename: String,
        originalName: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    completionStatus: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    supervisorRemarks: { type: String, trim: true, default: '' },
    approvedScore: { type: Number, default: null },
    finalScore: { type: Number, default: null },
    status: { type: String, enum: ['submitted', 'under-review', 'approved', 'rejected'], default: 'submitted' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    evaluationPeriod: {
      month: { type: Number, required: true },
      year: { type: Number, required: true },
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

performanceSchema.index({ employee: 1, kpi: 1, 'evaluationPeriod.month': 1, 'evaluationPeriod.year': 1 });

module.exports = mongoose.model('Performance', performanceSchema);
