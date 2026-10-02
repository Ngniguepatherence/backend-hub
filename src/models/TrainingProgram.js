const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a program title'],
    trim: true
  },
  code: {
    type: String,
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    enum: [
      'development',          // Web, Mobile, Cloud, DevOps
      'design',               // UI/UX, Graphisme, Figma
      'multimedia',           // Vidéo, Studio Audio, Podcast, Montage
      'marketing_digital',    // Community Management, SEO, Growth
      'business_management',  // Gestion d'entreprise, Comptabilité, Pitch
      'junior_camp',          // Junior Coder, Ateliers Vacances
      'data_ai',              // Data Science, IA générative, Automatisation
      'other'
    ],
    default: 'development'
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    default: '3 mois'
  },
  durationHours: {
    type: Number,
    default: 120
  },
  fee: {
    type: Number,
    required: [true, 'Please provide a program fee'],
    min: 0,
    default: 150000
  },
  installmentsAllowed: {
    type: Boolean,
    default: true
  },
  minInitialDeposit: {
    type: Number,
    default: 50000
  },
  type: {
    type: String,
    enum: ['professional_training', 'internship', 'bootcamp', 'holiday_camp', 'all'],
    default: 'professional_training'
  },
  prerequisites: [{
    type: String
  }],
  skillsAcquired: [{
    type: String
  }],
  certification: {
    type: String,
    default: 'Certificat Professionnel WDH'
  },
  maxCapacity: {
    type: Number,
    default: 15
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);
