const User = require('../models/User');

// @desc    Get user reports (from embedded array)
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('reports.module');
    
    if (user) {
      res.json(user.reports);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get report by ID (from embedded array)
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('reports.module');

    if (user) {
      const report = user.reports.id(req.params.id);
      if (report) {
        res.json(report);
      } else {
        res.status(404).json({ message: 'Report not found' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new report (push to embedded array)
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const {
      module,
      overallScore,
      interactionTime,
      speakingPace,
      fillerWords,
      skills,
      transcript,
      feedback
    } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      const newReport = {
        module,
        overallScore,
        interactionTime,
        speakingPace,
        fillerWords,
        skills,
        transcript,
        feedback
      };

      user.reports.push(newReport);
      await user.save();

      // Return the newly created report (it will be the last one in the array)
      const createdReport = user.reports[user.reports.length - 1];
      res.status(201).json(createdReport);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReports,
  getReportById,
  createReport
};
