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
    // Normalizing username to lowercase for case-insensitive authentication
    const normalizedUsername = username ? username.trim().toLowerCase() : '';
    const user = await User.findOne({ where: { username: normalizedUsername } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user.id),
        user: {
          id: user.id,
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
    const userCount = await User.count();
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
          id: user.id,
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

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'সব পাসওয়ার্ড ফিল্ড পূরণ করুন।' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'নতুন পাসওয়ার্ড দুটি মিলছে না।' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। আবার লগইন করুন।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পাসওয়ার্ড পরিবর্তন করা যায়নি।' });
  }
};

module.exports = {
  loginUser,
  registerSeedUser,
  getMe,
  changePassword
};
