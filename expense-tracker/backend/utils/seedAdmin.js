// Run with: npm run seed:admin
// Creates a default admin account: admin@example.com / admin123
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();

  const email = 'admin@example.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  await User.create({
    name: 'Admin',
    email,
    password: 'admin123',
    role: 'admin',
  });

  console.log('Admin created successfully:');
  console.log('  email: admin@example.com');
  console.log('  password: admin123');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
