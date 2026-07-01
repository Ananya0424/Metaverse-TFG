const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  employmentType: { type: String, default: 'Full-time' },
  experienceRequired: { type: String },
  skills: [{ type: String }],
  shortDescription: { type: String },
  fullDescription: { type: String },
  applyLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
