const express = require('express');
const router = express.Router();
const {
  getCommitteeMembers,
  getCommitteeMemberById,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember
} = require('../controllers/committeeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getCommitteeMembers)
  .post(protect, adminOnly, upload.single('photo'), createCommitteeMember);

router.route('/:id')
  .get(getCommitteeMemberById)
  .put(protect, adminOnly, upload.single('photo'), updateCommitteeMember)
  .delete(protect, adminOnly, deleteCommitteeMember);

module.exports = router;
