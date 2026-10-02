const mongoose = require('mongoose');

const hubServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
    trim: true
  },
  category: {
    type: String,
    enum: [
      'coworking',      // Pass journée, semaine, mois
      'private_office',  // Location bureau fermé
      'meeting_room',   // Salle de réunion visio/présentiel
      'event_hall',     // Salle d'événement, conférence, séminaire
      'studio',         // Studio d'enregistrement podcast/audio/vidéo
      'domiciliation',  // Domiciliation juridique & postale
      'printing',       // Impressions, photocopies, reliures
      'equipment',      // Location matériel informatique / photo / audio
      'catering',       // Pause-café, traiteur, snacks
      'training',       // Formations, masterclass, coaching
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  pricingModel: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'unit', 'fixed'],
    default: 'fixed'
  },
  durationUnit: {
    type: String,
    default: 'heure'
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HubService', hubServiceSchema);
