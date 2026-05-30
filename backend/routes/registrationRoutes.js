const express = require('express');
const router = express.Router();
const {
  submitRegistration,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public: Submit registration with optional photo upload
router.route('/')
  .post(upload.single('photo'), submitRegistration)
  .get(protect, getRegistrations);

// Admin: Update status or delete
router.route('/:id')
  .put(protect, updateRegistrationStatus)
  .delete(protect, deleteRegistration);

module.exports = router;
