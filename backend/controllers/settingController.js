const SchoolSetting = require('../models/SchoolSetting');

// @desc    Get active school settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    const settings = await SchoolSetting.findOne({});

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update school settings
// @route   POST /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  const {
    schoolName, schoolNameEnglish, establishedYear,
    address, phone, email, facebookLink, youtubeLink, aboutText
  } = req.body;

  try {
    const updateData = {
      schoolName: schoolName !== undefined ? schoolName : '',
      schoolNameEnglish: schoolNameEnglish !== undefined ? schoolNameEnglish : '',
      establishedYear: establishedYear !== undefined ? establishedYear : '',
      address: address !== undefined ? address : '',
      phone: phone !== undefined ? phone : '',
      email: email !== undefined ? email : '',
      facebookLink: facebookLink !== undefined ? facebookLink : '',
      youtubeLink: youtubeLink !== undefined ? youtubeLink : '',
      aboutText: aboutText !== undefined ? aboutText : ''
    };

    // Handle files if uploaded via Multer
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        updateData.logoUrl = `uploads/${req.files.logo[0].filename}`;
      }
      if (req.files.banner && req.files.banner[0]) {
        updateData.bannerUrl = `uploads/${req.files.banner[0].filename}`;
      }
    }

    // Save or update the single settings document in the database
    let settings = await SchoolSetting.findOne({});
    if (settings) {
      await settings.update(updateData);
    } else {
      settings = await SchoolSetting.create(updateData);
    }

    res.json({
      success: true,
      message: 'স্কুল সেটিংস সফলভাবে আপডেট করা হয়েছে।',
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
