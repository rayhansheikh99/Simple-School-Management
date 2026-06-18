const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  submitRegistration,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration
} = require('../controllers/registrationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Limit public form submissions only (not admin GET requests)
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many form submissions. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Public: Submit registration with optional photo upload
router.route('/')
  .post(formLimiter, upload.single('photo'), submitRegistration)
  .get(protect, getRegistrations);

// Admin: Update status or delete
router.route('/:id')
  .put(protect, adminOnly, updateRegistrationStatus)
  .delete(protect, adminOnly, deleteRegistration);

module.exports = router;
