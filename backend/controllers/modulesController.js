const Module = require('../models/Module');

// @desc    Get all modules
// @route   GET /api/modules
// @access  Private
const getModules = async (req, res) => {
  try {
    const modules = await Module.find({});
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get module by ID
// @route   GET /api/modules/:id
// @access  Private
const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (module) {
      res.json(module);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getModules,
  getModuleById
};
