const Teacher = require('../models/Teacher');
const fs = require('fs');
const path = require('path');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public
const getTeachers = async (req, res) => {
  try {
    // Sort teachers: head first, then assistants, then staff. Within that, sort by custom order field.
    const teachers = await Teacher.find({}).sort({ type: 1, order: 1 });

    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Public
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new teacher
// @route   POST /api/teachers
// @access  Private/Admin
const createTeacher = async (req, res) => {
  try {
    const { name, phone, subject, qualifications, type, order } = req.body;

    if (!name || !phone || !subject) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide teacher name, phone number, and subject' 
      });
    }

    // Capture file path if uploaded
    let photo = 'assets/images/default_teacher.png';
    if (req.file) {
      // Store relative path to uploads
      photo = `uploads/${req.file.filename}`;
    }

    const teacher = await Teacher.create({
      name,
      phone,
      subject,
      qualifications: qualifications || '',
      type: type || 'assistant',
      order: order ? parseInt(order, 10) : 0,
      photo
    });

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
const updateTeacher = async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const updateFields = { ...req.body };

    // Handle photo replacement if new file uploaded
    if (req.file) {
      // Delete old photo if it is a local upload
      if (teacher.photo && teacher.photo.startsWith('uploads/')) {
        const oldPhotoPath = path.join(__dirname, '../', teacher.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      updateFields.photo = `uploads/${req.file.filename}`;
    }

    if (updateFields.order) {
      updateFields.order = parseInt(updateFields.order, 10);
    }

    teacher = await Teacher.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Delete photo from disk if it was an uploaded file
    if (teacher.photo && teacher.photo.startsWith('uploads/')) {
      const photoPath = path.join(__dirname, '../', teacher.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Teacher removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
