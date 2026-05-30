const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', submitInquiry);

router.get('/messages', protect, getInquiries);
router.put('/messages/:id', protect, adminOnly, updateInquiryStatus);
router.delete('/messages/:id', protect, adminOnly, deleteInquiry);

module.exports = router;
