const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Job = require('../models/Job');
const { protect, adminOnly } = require('../middleware/auth');

// Admin dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments();
    const totalJobs = await Job.countDocuments();

    const users = await User.find({ role: 'user' });
    let totalEnrollments = 0;
    let totalCompletions = 0;
    let totalApplications = 0;
    users.forEach(u => {
      totalEnrollments += u.enrolledCourses.length;
      totalCompletions += u.enrolledCourses.filter(ec => ec.completed).length;
      totalApplications += u.appliedJobs.length;
    });

    res.json({
      totalUsers,
      totalCourses,
      totalJobs,
      totalEnrollments,
      totalCompletions,
      totalApplications
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .populate('enrolledCourses.course', 'title')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get course tracking (enrollments/completions per course)
router.get('/course-tracking', protect, adminOnly, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    const users = await User.find({ role: 'user' });

    const tracking = courses.map(course => {
      let enrolled = 0, completed = 0;
      users.forEach(u => {
        const ec = u.enrolledCourses.find(e => e.course.toString() === course._id.toString());
        if (ec) {
          enrolled++;
          if (ec.completed) completed++;
        }
      });
      return {
        _id: course._id,
        title: course.title,
        category: course.category,
        enrolled,
        completed,
        modules: course.modules.length
      };
    });

    res.json(tracking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get job applications
router.get('/job-applications', protect, adminOnly, async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('applicants.user', 'name email skills')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed demo data
router.post('/seed', protect, adminOnly, async (req, res) => {
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      await Course.insertMany([
        {
          title: 'Web Development Fundamentals',
          description: 'Learn HTML, CSS, and JavaScript from scratch. Build modern responsive websites.',
          category: 'Technology',
          level: 'Beginner',
          duration: '8 weeks',
          instructor: 'Admin',
          modules: [
            { title: 'Introduction to HTML', description: 'Learn HTML basics', content: 'HTML (HyperText Markup Language) is the foundation of web development. In this module, you\'ll learn about HTML structure, tags, attributes, and how to create your first webpage. We cover headings, paragraphs, links, images, lists, tables, and forms.', duration: 45, order: 1 },
            { title: 'CSS Styling', description: 'Style your web pages', content: 'CSS (Cascading Style Sheets) is used to style and layout web pages. This module covers selectors, properties, the box model, flexbox, grid, and responsive design using media queries.', duration: 60, order: 2 },
            { title: 'JavaScript Basics', description: 'Add interactivity', content: 'JavaScript brings websites to life. Learn variables, data types, functions, conditionals, loops, DOM manipulation, and event handling to create interactive web applications.', duration: 90, order: 3 }
          ],
          tags: ['html', 'css', 'javascript']
        },
        {
          title: 'Data Analysis with Python',
          description: 'Master data analysis techniques using Python, Pandas, and visualization libraries.',
          category: 'Data Science',
          level: 'Intermediate',
          duration: '10 weeks',
          instructor: 'Admin',
          modules: [
            { title: 'Python for Data Science', description: 'Python basics for analysts', content: 'This module introduces Python programming concepts essential for data science: variables, lists, dictionaries, functions, and libraries. You\'ll set up your environment and write your first data scripts.', duration: 60, order: 1 },
            { title: 'Data Manipulation with Pandas', description: 'Pandas library deep dive', content: 'Pandas is the go-to library for data manipulation. Learn DataFrames, Series, data cleaning, filtering, groupby operations, merging datasets, and handling missing values.', duration: 75, order: 2 },
            { title: 'Data Visualization', description: 'Create insightful charts', content: 'Visualize your data using Matplotlib and Seaborn. Create bar charts, scatter plots, heatmaps, and interactive dashboards. Learn storytelling with data.', duration: 60, order: 3 },
            { title: 'Statistical Analysis', description: 'Apply statistical methods', content: 'Apply descriptive and inferential statistics to your data. Understand distributions, hypothesis testing, correlation, regression analysis, and how to draw meaningful conclusions.', duration: 90, order: 4 }
          ],
          tags: ['python', 'pandas', 'data science']
        },
        {
          title: 'Project Management Professional',
          description: 'Comprehensive project management course covering agile, scrum, and traditional methodologies.',
          category: 'Business',
          level: 'Intermediate',
          duration: '6 weeks',
          instructor: 'Admin',
          modules: [
            { title: 'Project Management Fundamentals', description: 'Core PM concepts', content: 'Learn the fundamentals of project management: project lifecycle, stakeholder management, scope definition, work breakdown structures, and the role of a project manager.', duration: 50, order: 1 },
            { title: 'Agile & Scrum', description: 'Modern agile practices', content: 'Dive into agile methodology and scrum framework. Understand sprints, backlogs, user stories, ceremonies (standup, retrospective, planning), and how to manage agile teams effectively.', duration: 65, order: 2 },
            { title: 'Risk Management', description: 'Identify and mitigate risks', content: 'Identify, analyze, and respond to project risks. Learn risk matrices, mitigation strategies, contingency planning, and how to communicate risks to stakeholders.', duration: 45, order: 3 }
          ],
          tags: ['agile', 'scrum', 'leadership']
        }
      ]);
    }

    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.insertMany([
        {
          title: 'Frontend Developer',
          company: 'TechCorp Solutions',
          description: 'We are looking for a talented Frontend Developer to join our growing team. You will work on building responsive web applications using modern frameworks.',
          requirements: ['2+ years React experience', 'Strong HTML/CSS skills', 'JavaScript ES6+', 'REST API integration'],
          location: 'Remote',
          type: 'Full-time',
          salary: '$70,000 - $90,000',
          skills: ['React', 'JavaScript', 'CSS', 'HTML']
        },
        {
          title: 'Data Analyst',
          company: 'DataInsights Inc',
          description: 'Join our data team to analyze business data and provide actionable insights. You will work with large datasets and create executive dashboards.',
          requirements: ['Python proficiency', 'SQL knowledge', 'Tableau or Power BI', 'Statistical analysis'],
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$65,000 - $85,000',
          skills: ['Python', 'SQL', 'Data Visualization']
        },
        {
          title: 'Project Manager',
          company: 'Enterprise Systems',
          description: 'Lead cross-functional teams to deliver complex technology projects on time and within budget. PMP certification preferred.',
          requirements: ['3+ years PM experience', 'Agile/Scrum certified', 'Excellent communication', 'MS Project proficiency'],
          location: 'Chicago, IL',
          type: 'Full-time',
          salary: '$80,000 - $100,000',
          skills: ['Agile', 'Scrum', 'Leadership', 'Risk Management']
        },
        {
          title: 'Junior Web Developer',
          company: 'StartupHub',
          description: 'Great opportunity for recent graduates to gain hands-on experience in a fast-paced startup environment.',
          requirements: ['HTML/CSS/JS knowledge', 'Eager to learn', 'Team player', 'Portfolio preferred'],
          location: 'Remote',
          type: 'Internship',
          salary: '$20/hour',
          skills: ['HTML', 'CSS', 'JavaScript']
        }
      ]);
    }

    res.json({ message: 'Demo data seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
