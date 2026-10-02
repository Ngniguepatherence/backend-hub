const HubService = require('../models/HubService');

// @desc    Get all hub services
// @route   GET /api/services
// @access  Private
exports.getServices = async (req, res, next) => {
  try {
    const services = await HubService.find().sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hub service
// @route   POST /api/services
// @access  Private
exports.createService = async (req, res, next) => {
  try {
    const service = await HubService.create(req.body);
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hub service
// @route   PUT /api/services/:id
// @access  Private
exports.updateService = async (req, res, next) => {
  try {
    const service = await HubService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hub service
// @route   DELETE /api/services/:id
// @access  Private
exports.deleteService = async (req, res, next) => {
  try {
    const service = await HubService.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }
    res.status(200).json({ success: true, message: 'Service supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};
