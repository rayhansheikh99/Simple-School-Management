const express = require('express');
const router = express.Router();
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getNotices)
  .post(protect, upload.single('pdf'), createNotice);

router.route('/:id')
  .get(getNoticeById)
  .put(protect, upload.single('pdf'), updateNotice)
  .delete(protect, deleteNotice);

module.exports = router;
