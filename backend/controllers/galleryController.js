const GalleryItem = require('../models/GalleryItem');
const fs = require('fs');
const path = require('path');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    const items = await GalleryItem.findAll({
      where: filter,
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res) => {
  try {
    const { title, mediaType, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image/media file' });
    }

    const item = await GalleryItem.create({
      title: title || '',
      image: `uploads/${req.file.filename}`,
      mediaType: mediaType || 'image',
      category: category || 'events'
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    // Delete local file from disk
    if (item.image && item.image.startsWith('uploads/')) {
      const filePath = path.join(__dirname, '../', item.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await item.destroy();

    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem
};
