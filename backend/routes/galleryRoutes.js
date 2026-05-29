const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getGalleryItems)
  .post(protect, upload.single('image'), createGalleryItem);

router.route('/:id')
  .delete(protect, deleteGalleryItem);

module.exports = router;
