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
        schoolName: 'ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়',
        schoolNameEnglish: 'Demo Govt. Model Pilot High School',
        establishedYear: '১৯৪৮',
        address: 'মডেল টাউন, ঢাকা - ১২১৬',
        phone: '০১৭০০-০০০০০০',
        email: 'info@demoschool.edu.bd',
        logoUrl: 'assets/images/school_logo.png',
        bannerUrl: 'assets/images/hero_banner.png',
        facebookLink: 'https://facebook.com',
        youtubeLink: 'https://youtube.com',
        aboutText: 'ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয় অত্র অঞ্চলের একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। ১৯৪৮ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ দীর্ঘ দিন ধরে শিক্ষা, সংস্কৃতি ও ক্রীড়া ক্ষেত্রে গৌরবময় অবদান রেখে চলেছে।'
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
      schoolName: schoolName || 'ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়',
      schoolNameEnglish: schoolNameEnglish || 'Demo Govt. Model Pilot High School',
      establishedYear: establishedYear || '১৯৪৮',
      address: address || 'মডেল টাউন, ঢাকা - ১২১৬',
      phone: phone || '০১৭০০-০০০০০০',
      email: email || 'info@demoschool.edu.bd',
      facebookLink: facebookLink || 'https://facebook.com',
      youtubeLink: youtubeLink || 'https://youtube.com',
      aboutText: aboutText || 'ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয় অত্র অঞ্চলের একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান।'
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
    const settings = await SchoolSetting.findOneAndUpdate(
      {},
      updateData,
      { upsert: true, new: true, runValidators: true }
    );

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
