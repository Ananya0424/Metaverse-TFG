const mongoose = require('mongoose');

const embeddedReportSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  overallScore: {
    type: String, 
    default: ''
  },
  interactionTime: {
    type: String, 
    default: ''
  },
  speakingPace: {
    wpm: { type: Number, default: 0 },
    rating: { type: String, default: '' }
  },
  fillerWords: {
    count: { type: Number, default: 0 },
    rating: { type: String, default: '' }
  },
  skills: {
    communication: { type: String, enum: ['Novice', 'Intermediate', 'Advanced', 'Expert'], default: 'Novice' },
    problemSolving: { type: String, enum: ['Novice', 'Intermediate', 'Advanced', 'Expert'], default: 'Novice' },
    clarity: { type: String, enum: ['Novice', 'Intermediate', 'Advanced', 'Expert'], default: 'Novice' },
    bodyLanguage: { type: String, enum: ['Novice', 'Intermediate', 'Advanced', 'Expert'], default: 'Novice' }
  },
  transcript: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  reports: [embeddedReportSchema],
  mockInterviews: [{
    jobTitle: { type: String, default: 'Mock Interview' },
    overallScore: { type: String, default: '' },
    feedback: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }],
  resumes: [{
    fileName: { type: String, default: '' },
    parsedData: { type: mongoose.Schema.Types.Mixed },
    date: { type: Date, default: Date.now }
  }],
  productTrainingLogs: [{
    query: { type: String, required: true },
    response: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
