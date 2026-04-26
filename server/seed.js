const bcrypt = require('bcryptjs');
const { connectDb } = require('./config/db');
const env = require('./config/env');
const User = require('./models/User');

async function seedAdmin() {
  await connectDb(env.MONGO_URI);

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@blockx.ai';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  await User.create({
    name: 'BlockX Admin',
    email,
    password: hash,
    role: 'admin',
    availability: 'busy'
  });

  console.log(`Admin created: ${email}`);
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
