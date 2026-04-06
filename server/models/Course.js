const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // in minutes
  order: { type: Number, default: 0 }
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  duration: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  instructor: { type: String, default: 'Admin' },
  modules: [moduleSchema],
  enrollmentCount: { type: Number, default: 0 },
  completionCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
