const mongoose = require('mongoose');

const SchoolSettingSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: [true, 'বিদ্যালয়ের নাম আবশ্যক'],
    default: 'ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়'
  },
  schoolNameEnglish: {
    type: String,
    required: [true, 'ইংরেজি নাম আবশ্যক'],
    default: 'Demo Govt. Model Pilot High School'
  },
  establishedYear: {
    type: String,
    required: [true, 'প্রতিষ্ঠার বছর আবশ্যক'],
    default: '১৯৪৮'
  },
  address: {
    type: String,
    required: [true, 'ঠিকানা আবশ্যক'],
    default: 'মডেল টাউন, ঢাকা - ১২১৬'
  },
  phone: {
    type: String,
    required: [true, 'মোবাইল নম্বর আবশ্যক'],
    default: '০১৭০০-০০০০০০'
  },
  email: {
    type: String,
    required: [true, 'ইমেইল আবশ্যক'],
    default: 'info@demoschool.edu.bd'
  },
  logoUrl: {
    type: String,
    default: 'assets/images/school_logo.png'
  },
  bannerUrl: {
    type: String,
    default: 'assets/images/hero_bg.jpg'
  },
  facebookLink: {
    type: String,
    default: 'https://facebook.com'
  },
  youtubeLink: {
    type: String,
    default: 'https://youtube.com'
  },
  aboutText: {
    type: String,
    default: 'ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয় অত্র অঞ্চলের একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। ১৯৪৮ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ দীর্ঘ দিন ধরে শিক্ষা, সংস্কৃতি ও ক্রীড়া ক্ষেত্রে গৌরবময় অবদান রেখে চলেছে।'
  }
}, { timestamps: true });

module.exports = mongoose.model('SchoolSetting', SchoolSettingSchema);
