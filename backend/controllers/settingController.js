const SchoolSetting = require('../models/SchoolSetting');

// @desc    Get active school settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await SchoolSetting.findOne({});

    // If no settings exist yet, return a default mock object so the site never breaks
    if (!settings) {
      settings = {
        schoolName: 'গ্রিনফিল্ড একাডেমি',
        schoolNameEnglish: 'Rose Valley International College',
        establishedYear: '১৯৯৫',
        address: 'প্লট-১২, রোড-৩, সেক্টর-৪, উত্তরা, ঢাকা',
        phone: '০১৭০০-০০০০০০, ০১৮০০-০০০০০০, ০১৯০০-০০০০০০',
        email: 'demo@greenfieldacademy.edu.bd',
        logoUrl: 'assets/images/school_logo.png',
        bannerUrl: 'assets/images/hero_banner.png',
        facebookLink: 'https://facebook.com',
        youtubeLink: 'https://youtube.com',
        aboutText: 'গ্রিনফিল্ড একাডেমি অত্র অঞ্চলের একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। ১৯৯৫ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ দীর্ঘ দিন ধরে শিক্ষা, সংস্কৃতি ও ক্রীড়া ক্ষেত্রে গৌরবময় অবদান রেখে চলেছে।'
      };
    }

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
      schoolName: schoolName || 'গ্রিনফিল্ড একাডেমি',
      schoolNameEnglish: schoolNameEnglish || 'Rose Valley International College',
      establishedYear: establishedYear || '১৯৯৫',
      address: address || 'প্লট-১২, রোড-৩, সেক্টর-৪, উত্তরা, ঢাকা',
      phone: phone || '০১৭০০-০০০০০০, ০১৮০০-০০০০০০, ০১৯০০-০০০০০০',
      email: email || 'demo@greenfieldacademy.edu.bd',
      facebookLink: facebookLink || 'https://facebook.com',
      youtubeLink: youtubeLink || 'https://youtube.com',
      aboutText: aboutText || 'গ্রিনফিল্ড একাডেমি অত্র অঞ্চলের একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান।'
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
