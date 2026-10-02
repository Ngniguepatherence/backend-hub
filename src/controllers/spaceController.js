const Space = require('../models/Space');

// @desc    Get all spaces
// @route   GET /api/spaces
// @access  Private
exports.getSpaces = async (req, res, next) => {
  try {
    const spaces = await Space.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: spaces.length,
      data: spaces
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single space
// @route   GET /api/spaces/:id
// @access  Private
exports.getSpace = async (req, res, next) => {
  try {
    const space = await Space.findById(req.params.id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    res.status(200).json({
      success: true,
      data: space
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new space
// @route   POST /api/spaces
// @access  Private
exports.createSpace = async (req, res, next) => {
  try {
    const space = await Space.create(req.body);

    res.status(201).json({
      success: true,
      data: space
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update space
// @route   PUT /api/spaces/:id
// @access  Private
exports.updateSpace = async (req, res, next) => {
  try {
    const space = await Space.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    res.status(200).json({
      success: true,
      data: space
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete space
// @route   DELETE /api/spaces/:id
// @access  Private
exports.deleteSpace = async (req, res, next) => {
  try {
    const space = await Space.findByIdAndDelete(req.params.id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Space not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Space deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

