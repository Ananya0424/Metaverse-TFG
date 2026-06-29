const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['VR', 'WEB'],
    default: 'WEB'
  },
  duration: {
    type: String,
    default: '0 mins'
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  // Sub-modules specific for UI rendering and hierarchy
  subModules: [{
    title: String,
    status: {
      type: String,
      enum: ['available', 'locked', 'completed'],
      default: 'locked'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Module', moduleSchema);
