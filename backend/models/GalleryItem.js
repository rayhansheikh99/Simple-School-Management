const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    type: String,
    required: [true, 'Please add image path or URL'],
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  category: {
    type: String,
    enum: ['campus', 'events', 'sports', 'academic'],
    default: 'events',
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);
