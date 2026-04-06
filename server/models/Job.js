const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  location: { type: String, default: '' },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'], default: 'Full-time' },
  salary: { type: String, default: '' },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
    coverLetter: { type: String, default: '' }
  }],
  skills: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
