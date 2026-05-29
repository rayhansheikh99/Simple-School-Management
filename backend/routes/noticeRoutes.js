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

router.route('/')
  .get(getNotices)
  .post(protect, createNotice);

router.route('/:id')
  .get(getNoticeById)
  .put(protect, updateNotice)
  .delete(protect, deleteNotice);

module.exports = router;
