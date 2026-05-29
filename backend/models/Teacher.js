const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add teacher name'],
    trim: true,
  },
  designation: {
    type: String,
    required: [true, 'Please add designation'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Please add subject taught'],
    trim: true,
  },
  qualifications: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default: 'assets/images/default_teacher.png',
  },
  type: {
    type: String,
    enum: ['head', 'assistant', 'staff'],
    default: 'assistant',
  },
  order: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
