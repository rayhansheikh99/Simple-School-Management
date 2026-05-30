const Notice = require('../models/Notice');
const fs = require('fs');
const path = require('path');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res) => {
  try {
    const queryObj = {};

    // Filter by category if provided
    if (req.query.category && req.query.category !== 'all') {
      queryObj.category = req.query.category;
    }

    // Determine limit
    let query = Notice.find(queryObj).sort({ date: -1 });
    
    if (req.query.limit) {
      const limit = parseInt(req.query.limit, 10);
      query = query.limit(limit);
    }

    const notices = await query;

    res.json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please add a title and content' });
    }

    // Handle PDF upload if any
    let pdfUrl = '';
    if (req.file) {
      pdfUrl = `uploads/${req.file.filename}`;
    } else if (req.body.pdfUrl) {
      pdfUrl = req.body.pdfUrl;
    }

    const notice = await Notice.create({
      title,
      content,
      category: category || 'academic',
      pdfUrl
    });

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res) => {
  try {
    let notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    const updateFields = { ...req.body };

    // Handle PDF replacement if new file uploaded
    if (req.file) {
      // Delete old PDF if it is a local upload
      if (notice.pdfUrl && notice.pdfUrl.startsWith('uploads/')) {
        const oldPdfPath = path.join(__dirname, '../', notice.pdfUrl);
        if (fs.existsSync(oldPdfPath)) {
          fs.unlinkSync(oldPdfPath);
        }
      }
      updateFields.pdfUrl = `uploads/${req.file.filename}`;
    }

    notice = await Notice.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    // Delete PDF file from disk if it was an uploaded file
    if (notice.pdfUrl && notice.pdfUrl.startsWith('uploads/')) {
      const pdfPath = path.join(__dirname, '../', notice.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Notice removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
};
