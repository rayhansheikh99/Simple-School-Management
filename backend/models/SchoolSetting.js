const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const SchoolSetting = sequelize.define('SchoolSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ'
  },
  schoolNameEnglish: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Blooming Flower International College'
  },
  establishedYear: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '২০১৪'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'প্লট-২৮, রোড-১, ফুলবাড়িয়া মেইন রোড, সেক্টর-১০, উত্তরা (তুরাগ), ঢাকা'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '০১৭৩৬-১৫৩৪৪৩, ০১৬৪৪-৪৪২৯৩০, ০১৯৭৪-০১১৩০৪, ০১৯৯৯-৯৭৬৬২৫'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'mosharafhighschool@gmail.com, bloomingflowercollege2014@gmail.com'
  },
  logoUrl: {
    type: DataTypes.STRING,
    defaultValue: 'assets/images/school_logo.png'
  },
  bannerUrl: {
    type: DataTypes.STRING,
    defaultValue: 'assets/images/hero_banner.png'
  },
  facebookLink: {
    type: DataTypes.STRING,
    defaultValue: 'https://facebook.com'
  },
  youtubeLink: {
    type: DataTypes.STRING,
    defaultValue: 'https://youtube.com'
  },
  aboutText: {
    type: DataTypes.TEXT,
    defaultValue: 'ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ অত্র অঞ্চলের একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। ২০১৪ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ দীর্ঘ দিন ধরে শিক্ষা, সংস্কৃতি ও ক্রীড়া ক্ষেত্রে গৌরবময় অবদান রেখে চলেছে।'
  }
}, {
  timestamps: true
});

SchoolSetting.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = SchoolSetting;
