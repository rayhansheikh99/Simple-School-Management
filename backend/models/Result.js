const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Please add student name'],
    trim: true,
  },
  roll: {
    type: Number,
    required: [true, 'Please add roll number'],
  },
  class: {
    type: String,
    required: [true, 'Please add class (e.g. 6, 7, 8, 9, 10)'],
  },
  section: {
    type: String,
    default: 'A',
  },
  department: {
    type: String,
    enum: ['science', 'humanities', 'commerce', 'none'],
    default: 'none',
  },
  examType: {
    type: String,
    enum: ['half-yearly', 'annual', 'ssc'],
    required: [true, 'Please specify exam type'],
  },
  year: {
    type: Number,
    required: [true, 'Please add exam year'],
  },
  totalMarks: {
    type: Number,
    default: 0,
  },
  grade: {
    type: String,
    default: 'N/A',
  },
  gpa: {
    type: Number,
    default: 0.0,
  }
});

// Ensure a student roll in a class for a specific exam in a given year is unique
ResultSchema.index({ roll: 1, class: 1, examType: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Result', ResultSchema);
