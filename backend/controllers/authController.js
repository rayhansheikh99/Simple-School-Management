const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'demo_school_super_secret_jwt_key_123456789!', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Normalizing username to lowercase for case-insensitive authentication (e.g. Admin, admin, ADMIN)
    const normalizedUsername = username ? username.trim().toLowerCase() : '';
    const user = await User.findOne({ username: normalizedUsername }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a seed user (Development & Setup helper)
// @route   POST /api/auth/register-seed
// @access  Public (Only runs if no users exist)
const registerSeedUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if any user exists
    const userCount = await User.countDocuments({});
    if (userCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin seeding is disabled because an admin account already exists.' 
      });
    }

    if (!username || !password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username and password (min 6 characters).' 
      });
    }

    const user = await User.create({
      username,
      password,
      role: 'admin'
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Default admin user successfully registered!',
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  loginUser,
  registerSeedUser,
  getMe
};
