const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', submitInquiry);

router.get('/messages', protect, getInquiries);
router.put('/messages/:id', protect, updateInquiryStatus);
router.delete('/messages/:id', protect, deleteInquiry);

module.exports = router;
