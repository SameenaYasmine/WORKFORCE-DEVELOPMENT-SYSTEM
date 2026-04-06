const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');
const { v4: uuidv4 } = require('crypto');

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, bio, skills, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, bio, skills, location },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in course
router.post('/enroll/:courseId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = user.enrolledCourses.some(
      ec => ec.course.toString() === req.params.courseId
    );
    if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled' });

    user.enrolledCourses.push({ course: req.params.courseId });
    await user.save();

    course.enrollmentCount = (course.enrollmentCount || 0) + 1;
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Complete a module
router.post('/complete-module/:courseId/:moduleId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = user.enrolledCourses.find(
      ec => ec.course.toString() === req.params.courseId
    );
    if (!enrollment) return res.status(400).json({ message: 'Not enrolled in this course' });

    const moduleId = req.params.moduleId;
    if (!enrollment.completedModules.includes(moduleId)) {
      enrollment.completedModules.push(moduleId);
    }

    const totalModules = course.modules.length;
    const completedCount = enrollment.completedModules.length;
    enrollment.progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    // Auto-complete course if all modules done
    if (completedCount >= totalModules && totalModules > 0 && !enrollment.completed) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();

      // Generate certificate
      const certId = `WDS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const alreadyCertified = user.certificates.some(c => c.course.toString() === req.params.courseId);
      if (!alreadyCertified) {
        user.certificates.push({ course: req.params.courseId, certificateId: certId });
        course.completionCount = (course.completionCount || 0) + 1;
        await course.save();
      }
    }

    await user.save();
    res.json({
      progress: enrollment.progress,
      completed: enrollment.completed,
      message: enrollment.completed ? 'Course completed! Certificate issued.' : 'Module completed'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply for job
router.post('/apply-job/:jobId', protect, async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const user = await User.findById(req.user._id);
    const alreadyApplied = user.appliedJobs.some(aj => aj.job.toString() === req.params.jobId);
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });

    user.appliedJobs.push({ job: req.params.jobId });
    await user.save();

    job.applicants.push({ user: req.user._id, coverLetter: coverLetter || '' });
    await job.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user dashboard data
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses.course', 'title description thumbnail category level')
      .populate('certificates.course', 'title')
      .populate('appliedJobs.job', 'title company type');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
