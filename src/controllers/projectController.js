const Project = require('../models/Project');
const Client = require('../models/Client');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const { category, status, type } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (type) query.type = type;

    const projects = await Project.find(query)
      .populate('clientId', 'name company email')
      .sort({ deadline: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name company email phone');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    // Handle client assignment
    if (req.body.clientId && req.body.clientId !== '' && req.body.clientId !== 'null' && req.body.clientId !== 'internal') {
      const client = await Client.findById(req.body.clientId);
      if (client) {
        req.body.client = client.name;
        if (!req.body.clientEmail) req.body.clientEmail = client.email;
        if (!req.body.clientPhone) req.body.clientPhone = client.phone;
        if (!req.body.clientType) req.body.clientType = client.type === 'individual' ? 'individual' : 'corporate';
      }
    } else if (req.body.client && req.body.client.trim() !== '' && req.body.client !== 'Internal') {
      // Direct client name (e.g. Particulier / Client Direct)
      req.body.clientId = null;
      if (!req.body.clientType) req.body.clientType = 'individual';
    } else {
      // For internal projects, set clientId to null
      req.body.clientId = null;
      req.body.client = req.body.category === 'internal' ? 'Internal' : (req.body.client || 'Client Particulier');
      req.body.clientType = req.body.category === 'internal' ? 'internal' : 'individual';
    }
    
    // Calculate total price from services or quote
    if (req.body.services && Array.isArray(req.body.services) && req.body.services.length > 0) {
      req.body.totalPrice = req.body.services.reduce((sum, service) => {
        return sum + ((Number(service.price) || 0) * (Number(service.quantity) || 1));
      }, 0);
    } else if (req.body.quote && req.body.quote.totalAmount) {
      req.body.totalPrice = Number(req.body.quote.totalAmount) || 0;
    } else if (!req.body.totalPrice) {
      req.body.totalPrice = req.body.budget || 0;
    }

    // Initialize budget fields
    if (!req.body.allocatedBudget) {
      req.body.allocatedBudget = req.body.budget || req.body.totalPrice || 0;
    }
    if (!req.body.spentBudget) {
      req.body.spentBudget = 0;
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    // Calculate total price if services were updated
    if (req.body.services && Array.isArray(req.body.services)) {
      req.body.totalPrice = req.body.services.reduce((sum, service) => {
        return sum + (service.price * (service.quantity || 1));
      }, 0);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('clientId');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project status
// @route   PATCH /api/projects/:id/status
// @access  Private
exports.updateProjectStatus = async (req, res, next) => {
  try {
    const { status, currentPhase, progress } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        currentPhase: currentPhase || undefined,
        progress: progress || undefined
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add deliverable to project
// @route   POST /api/projects/:id/deliverables
// @access  Private
exports.addDeliverable = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.deliverables.push(req.body);
    await project.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update deliverable status
// @route   PATCH /api/projects/:id/deliverables/:deliverableIndex
// @access  Private
exports.updateDeliverable = async (req, res, next) => {
  try {
    const { id, deliverableIndex } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.deliverables[deliverableIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Deliverable not found'
      });
    }

    Object.assign(project.deliverables[deliverableIndex], req.body);
    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to project
// @route   POST /api/projects/:id/notes
// @access  Private
exports.addNote = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.notes.push({
      author: req.body.author || 'User',
      content: req.body.content,
      createdAt: new Date()
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

