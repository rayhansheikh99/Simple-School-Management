const mongoose = require('mongoose');

const StudentRegistrationSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'শিক্ষার্থীর নাম আবশ্যক'],
    trim: true,
  },
  fatherName: {
    type: String,
    required: [true, 'পিতার নাম আবশ্যক'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'মাতার নাম আবশ্যক'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'জন্ম তারিখ আবশ্যক'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'লিঙ্গ নির্বাচন আবশ্যক'],
  },
  desiredClass: {
    type: String,
    enum: ['6', '7', '8', '9', '10'],
    required: [true, 'ভর্তি ইচ্ছুক শ্রেণি নির্বাচন আবশ্যক'],
  },
  phone: {
    type: String,
    required: [true, 'অভিভাবকের মোবাইল নম্বর আবশ্যক'],
    trim: true,
  },
  email: {
    type: String,
    default: '',
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'বর্তমান ঠিকানা আবশ্যক'],
    trim: true,
  },
  previousSchool: {
    type: String,
    default: '',
    trim: true,
  },
  photo: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('StudentRegistration', StudentRegistrationSchema);
