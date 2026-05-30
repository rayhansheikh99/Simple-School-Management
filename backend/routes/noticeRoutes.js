const express = require('express');
const router = express.Router();
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getNotices)
  .post(protect, adminOnly, upload.single('pdf'), createNotice);

router.route('/:id')
  .get(getNoticeById)
  .put(protect, adminOnly, upload.single('pdf'), updateNotice)
  .delete(protect, adminOnly, deleteNotice);

module.exports = router;
