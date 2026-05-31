const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add result title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add result description'],
  },
  class: {
    type: String,
    required: [true, 'Please specify class (e.g. 6, 7, 8, 9, 10, all)'],
    default: 'all',
  },
  year: {
    type: Number,
    required: [true, 'Please specify year'],
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

module.exports = mongoose.model('Result', ResultSchema);
