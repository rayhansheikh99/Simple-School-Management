const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getTeachers)
  .post(protect, upload.single('photo'), createTeacher);

router.route('/:id')
  .get(getTeacherById)
  .put(protect, upload.single('photo'), updateTeacher)
  .delete(protect, deleteTeacher);

module.exports = router;
