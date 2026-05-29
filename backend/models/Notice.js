const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a notice title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add notice content'],
  },
  category: {
    type: String,
    enum: ['academic', 'exam', 'event', 'admin'],
    default: 'academic',
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Notice', NoticeSchema);
