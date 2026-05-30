const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getGalleryItems)
  .post(protect, adminOnly, upload.single('image'), createGalleryItem);

router.route('/:id')
  .delete(protect, adminOnly, deleteGalleryItem);

module.exports = router;
