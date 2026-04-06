const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workforce_dev';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Import models inline (they need to be registered)
  const userSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String, role: String,
    phone: String, bio: String, skills: [String], location: String,
    enrolledCourses: [mongoose.Schema.Types.Mixed],
    certificates: [mongoose.Schema.Types.Mixed],
    appliedJobs: [mongoose.Schema.Types.Mixed]
  }, { timestamps: true });
  const User = mongoose.models.User || mongoose.model('User', userSchema);

  // Admin account
  const adminExists = await User.findOne({ email: 'admin@workforce.com' });
  if (!adminExists) {
    const hashedPw = await bcrypt.hash('Admin@123', 12);
    await User.create({ name: 'Admin User', email: 'admin@workforce.com', password: hashedPw, role: 'admin' });
    console.log('✅ Admin created: admin@workforce.com / Admin@123');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  // Demo user
  const userExists = await User.findOne({ email: 'user@workforce.com' });
  if (!userExists) {
    const hashedPw = await bcrypt.hash('User@123', 12);
    await User.create({
      name: 'Demo User',
      email: 'user@workforce.com',
      password: hashedPw,
      role: 'user',
      skills: ['JavaScript', 'React', 'Problem Solving'],
      location: 'New York, USA',
      bio: 'Aspiring full-stack developer passionate about learning new technologies.'
    });
    console.log('✅ Demo user created: user@workforce.com / User@123');
  } else {
    console.log('ℹ️  Demo user already exists');
  }

  console.log('\n🎉 Seed completed! Start the server and login with the credentials above.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
