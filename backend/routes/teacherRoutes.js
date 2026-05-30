const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getTeachers)
  .post(protect, adminOnly, upload.single('photo'), createTeacher);

router.route('/:id')
  .get(getTeacherById)
  .put(protect, adminOnly, upload.single('photo'), updateTeacher)
  .delete(protect, adminOnly, deleteTeacher);

module.exports = router;
