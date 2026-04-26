const mongoose = require('mongoose');

const uri = process.env.MONGO_URI ||
  'mongodb+srv://blockx:jaimatadi@cluster0.aws3tvj.mongodb.net/blockx?retryWrites=true&w=majority';

async function test() {
  try {
    // Mongoose 7+ no longer requires these options; pass the URI directly
    await mongoose.connect(uri);
    console.log('connected');
    process.exit(0);
  } catch (err) {
    console.error('connect error:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

test();
