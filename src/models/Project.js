const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  dueDate: Date,
  submittedDate: Date
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description']
  },
  client: {
    type: String,
    required: false,
    default: null
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false,
    default: null
  },
  type: {
    type: String,
    enum: [
      'digital_transformation',
      'digital_marketing',
      'website',
      'mobile_app',
      'web_app_saas',
      'video',
      'audio',
      'podcast',
      'logo',
      'branding',
      'flyers',
      'other'
    ],
    required: [true, 'Please provide a project type']
  },
  clientType: {
    type: String,
    enum: ['corporate', 'individual', 'internal'],
    default: 'corporate'
  },
  clientEmail: {
    type: String,
    trim: true,
    default: null
  },
  clientPhone: {
    type: String,
    trim: true,
    default: null
  },
  clientAddress: {
    type: String,
    trim: true,
    default: null
  },
  category: {
    type: String,
    enum: ['internal', 'client'],
    default: 'client'
  },
  status: {
    type: String,
    enum: ['briefing', 'quote', 'approved', 'production', 'review', 'delivery', 'completed', 'on_hold', 'cancelled'],
    default: 'briefing'
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline']
  },
  budget: {
    type: Number,
    required: [false, 'Please provide a budget'],
    min: 0
  },
  allocatedBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  spentBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  services: {
    type: [serviceSchema],
    required: false,
    default: []
  },
  deliverables: [deliverableSchema],
  assignee: {
    type: String,
    required: true
  },
  teamMembers: [String],
  currentPhase: {
    type: String,
    enum: [
      'briefing',
      'planning',
      'design_ui_ux',
      'development',
      'production',
      'post_production',
      'qa_testing',
      'review',
      'delivery',
      'completed'
    ],
    default: 'briefing'
  },
  files: [{
    name: String,
    url: String,
    uploadedDate: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    author: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  quote: {
    quoteNumber: String,
    issuedDate: Date,
    validUntil: Date,
    totalAmount: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'approved', 'rejected', 'expired'],
      default: 'draft'
    },
    terms: String,
    notes: String,
    items: [{
      description: String,
      quantity: {
        type: Number,
        default: 1
      },
      unitPrice: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      }
    }]
  },
  invoice: {
    invoiceNumber: String,
    issuedDate: Date,
    dueDate: Date,
    paidAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);

