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
    defaultValue: 'নবমল্লিকা মডেল একাডেমী'
  },
  schoolNameEnglish: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Nobomallika Model Academy'
  },
  establishedYear: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '২০০৪'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'রসুলনগর, সারুলিয়া, ডেমরা, ঢাকা'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '০১৬১৮-৪৪৪৬৩৭, ০১৩০৯-১৩৮৯৪৪, ০১৮০০-০০০০০০, ০১৯০০-০০০০০০'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'nobomillika2003@gmail.com'
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
    defaultValue: 'নবমল্লিকা মডেল একাডেমী অত্র অঞ্চলের একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। ১৯৯৫ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ দীর্ঘ দিন ধরে শিক্ষা, সংস্কৃতি ও ক্রীড়া ক্ষেত্রে গৌরবময় অবদান রেখে চলেছে।'
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
