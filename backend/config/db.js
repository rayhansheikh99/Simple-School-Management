const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/demo_school');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-create viewer user (read-only) if it does not exist
    const viewerExists = await User.findOne({ username: 'user' });
    if (!viewerExists) {
      await User.create({
        username: 'user',
        password: 'pass123',
        role: 'viewer'
      });
      console.log('Read-only viewer user ("user" / "pass123") auto-created successfully.');
    }
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
