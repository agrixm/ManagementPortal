const mongoose = require('mongoose');

async function connectDb(uri) {
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = { connectDb };
