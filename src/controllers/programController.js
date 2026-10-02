const TrainingProgram = require('../models/TrainingProgram');

const defaultPrograms = [
  {
    title: 'Développement Web Fullstack (Next.js, Node.js & TypeScript)',
    code: 'WDH-DEV-FULL',
    category: 'development',
    type: 'professional_training',
    description: 'Formation intensive et professionnalisante couvrant le développement frontend moderne avec React/Next.js, architectures d\'APIs robustes en Node.js, bases de données relationnelles et NoSQL, et déploiement CI/CD Cloud.',
    duration: '3 à 6 mois',
    durationHours: 180,
    fee: 150000,
    installmentsAllowed: true,
    minInitialDeposit: 50000,
    skillsAcquired: ['React & Next.js', 'Node.js & Express', 'PostgreSQL & MongoDB', 'API REST & WebSockets', 'Git & Docker', 'Déploiement Cloud'],
    certification: 'Certificat Professionnel Développeur Web Fullstack WDH',
    maxCapacity: 15,
    isActive: true
  },
  {
    title: 'Développement Mobile Flutter & Dart',
    code: 'WDH-DEV-MOB',
    category: 'development',
    type: 'professional_training',
    description: 'Maîtrisez la création d\'applications mobiles iOS et Android natives avec un seul code source performant avec Flutter, intégration Firebase, Mobile Money et publication sur stores.',
    duration: '3 à 6 mois',
    durationHours: 160,
    fee: 180000,
    installmentsAllowed: true,
    minInitialDeposit: 60000,
    skillsAcquired: ['Flutter & Dart', 'State Management (Bloc/Riverpod)', 'Firebase & Cloud Functions', 'Paiements Mobile Money', 'Publishing App Store/Play Store'],
    certification: 'Certificat Développeur Mobile Cross-Platform WDH',
    maxCapacity: 12,
    isActive: true
  },
  {
    title: 'UI/UX Design & Prototypage Avancé Figma',
    code: 'WDH-DSN-UIUX',
    category: 'design',
    type: 'professional_training',
    description: 'Apprenez la recherche utilisateur, l\'architecture de l\'information, le design system, l\'ergonomie d\'interfaces modernes web/mobile et le prototypage interactif haute fidélité.',
    duration: '3 mois',
    durationHours: 120,
    fee: 120000,
    installmentsAllowed: true,
    minInitialDeposit: 40000,
    skillsAcquired: ['User Research & Personas', 'Wireframing & UX Flows', 'Design Systems Figma', 'Micro-interactions & Animations', 'Tests d\'Utilisabilité'],
    certification: 'Certificat UI/UX Product Designer WDH',
    maxCapacity: 15,
    isActive: true
  },
  {
    title: 'Production Audiovisuelle & Montage Vidéo 4K',
    code: 'WDH-MED-VID',
    category: 'multimedia',
    type: 'professional_training',
    description: 'Prise en main des caméras professionnelles Sony/Blackmagic, techniques d\'éclairage studio, captation multi-caméras, étalonnage colorimétrique et montage DaVinci Resolve & Premiere Pro.',
    duration: '3 mois',
    durationHours: 130,
    fee: 150000,
    installmentsAllowed: true,
    minInitialDeposit: 50000,
    skillsAcquired: ['Prise de vue & Éclairage Studio', 'DaVinci Resolve & Premiere Pro', 'Étalonnage Colorimétrique', 'Motion Graphics & Titrage', 'Export Broadcast & Réseaux Sociaux'],
    certification: 'Certificat Monteur & Cadreur Vidéo Pro WDH',
    maxCapacity: 10,
    isActive: true
  },
  {
    title: 'Ingénierie du Son, Mixage & Podcast Studio',
    code: 'WDH-MED-SON',
    category: 'multimedia',
    type: 'professional_training',
    description: 'Maîtrise de l\'enregistrement voix, mixage audio, traitement acoustique, sound design et réalisation d\'émissions de podcast professionnelles dans notre studio insonorisé.',
    duration: '3 mois',
    durationHours: 110,
    fee: 150000,
    installmentsAllowed: true,
    minInitialDeposit: 50000,
    skillsAcquired: ['Microphonie & Acoustique', 'Logiciels DAW (Logic/Ableton/ProTools)', 'Nettoyage & Égalisation Voix', 'Mixage & Mastering Podcast', 'Diffusion Plateformes Audio'],
    certification: 'Certificat Opérateur Audio & Podcast WDH',
    maxCapacity: 10,
    isActive: true
  },
  {
    title: 'Marketing Digital, Social Media Management & Growth',
    code: 'WDH-MKT-DIG',
    category: 'marketing_digital',
    type: 'professional_training',
    description: 'Stratégie de contenu, gestion des réseaux sociaux, acquisition payante Meta Ads/Google Ads, optimisation SEO, emailing automatisé et conversion de prospects en clients.',
    duration: '2 à 3 mois',
    durationHours: 90,
    fee: 100000,
    installmentsAllowed: true,
    minInitialDeposit: 40000,
    skillsAcquired: ['Stratégie de Contenu & Copywriting', 'Meta Ads & Google Ads', 'SEO & Analytics', 'Emailing & Automation', 'Gestion de Communautés'],
    certification: 'Certificat Marketing Digital & Growth WDH',
    maxCapacity: 15,
    isActive: true
  },
  {
    title: 'Stage Académique & Immersion Entreprise (Informatique & Multimédia)',
    code: 'WDH-STG-ACAD',
    category: 'development',
    type: 'internship',
    description: 'Encadrement pratique et mentorat par nos ingénieurs pour la réalisation de projets de fin d\'études (BTS, Licence, Master d\'ingénierie) avec délivrance d\'attestation officielle de stage.',
    duration: '2 à 4 mois',
    durationHours: 200,
    fee: 50000,
    installmentsAllowed: true,
    minInitialDeposit: 25000,
    skillsAcquired: ['Travail en Équipe Agile', 'Méthodologie Projet Réel', 'Revue de Code & Bonnes Pratiques', 'Rédaction Rapport de Stage'],
    certification: 'Attestation de Stage Professionnel & Académique WDH',
    maxCapacity: 20,
    isActive: true
  },
  {
    title: 'Junior Coder (8 à 14 ans) - Initiation Programmation & Robotique',
    code: 'WDH-JUN-CODE',
    category: 'junior_camp',
    type: 'holiday_camp',
    description: 'Ateliers ludiques pour enfants et adolescents : découverte de la logique algorithmique avec Scratch, création de jeux 2D, initiation à Python et découverte de la robotique.',
    duration: '1 mois / Sessions Vacances',
    durationHours: 40,
    fee: 45000,
    installmentsAllowed: false,
    minInitialDeposit: 45000,
    skillsAcquired: ['Logique Algorithmique & Scratch', 'Création de Mini-Jeux', 'Introduction à Python', 'Sécurité et Bonnes Pratiques Web'],
    certification: 'Diplôme Junior Coder WDH',
    maxCapacity: 15,
    isActive: true
  }
];

// @desc    Get all training programs (with auto-seed if empty)
// @route   GET /api/programs
// @access  Public or Private
exports.getPrograms = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }
    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    let programs = await TrainingProgram.find(query).sort({ createdAt: -1 });

    // Seed default programs if collection is empty
    if (programs.length === 0 && Object.keys(query).length === 0) {
      programs = await TrainingProgram.insertMany(defaultPrograms);
    }

    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single training program
// @route   GET /api/programs/:id
// @access  Private
exports.getProgram = async (req, res, next) => {
  try {
    const program = await TrainingProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new training program
// @route   POST /api/programs
// @access  Private
exports.createProgram = async (req, res, next) => {
  try {
    const program = await TrainingProgram.create(req.body);

    res.status(201).json({
      success: true,
      data: program
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update training program (e.g. fees, duration, title, status)
// @route   PUT /api/programs/:id
// @access  Private
exports.updateProgram = async (req, res, next) => {
  try {
    const program = await TrainingProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete training program
// @route   DELETE /api/programs/:id
// @access  Private
exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await TrainingProgram.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
