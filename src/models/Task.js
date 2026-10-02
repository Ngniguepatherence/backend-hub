const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please provide a comment content'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Please provide an assignee ID']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date']
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  completedAt: {
    type: Date,
    default: null
  },
  comments: [commentSchema],
  completionNote: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ assigneeId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);

