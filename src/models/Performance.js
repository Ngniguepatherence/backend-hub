const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  period: {
    type: String, // Format: 'YYYY-MM' for monthly, 'YYYY-WW' for weekly
    required: true
  },
  periodType: {
    type: String,
    enum: ['weekly', 'monthly'],
    default: 'monthly'
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  inProgressTasks: {
    type: Number,
    default: 0
  },
  pendingTasks: {
    type: Number,
    default: 0
  },
  overdueTasks: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  onTimeRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  avgCompletionTime: {
    type: Number, // in days
    default: 0
  },
  tasksThisPeriod: {
    type: Number,
    default: 0
  },
  performanceLevel: {
    type: String,
    enum: ['excellent', 'good', 'average', 'needs_improvement'],
    default: 'average'
  }
}, {
  timestamps: true
});

// Index for efficient queries
performanceSchema.index({ employeeId: 1, period: -1 });
performanceSchema.index({ period: -1 });

module.exports = mongoose.model('Performance', performanceSchema);
