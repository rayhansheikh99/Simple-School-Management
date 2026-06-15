const CommitteeMember = require('../models/CommitteeMember');
const fs = require('fs');
const path = require('path');

// @desc    Get all committee members
// @route   GET /api/committee
// @access  Public
const getCommitteeMembers = async (req, res) => {
  try {
    const members = await CommitteeMember.findAll({
      order: [
        ['order', 'ASC'],
        ['id', 'ASC']
      ]
    });

    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single committee member
// @route   GET /api/committee/:id
// @access  Public
const getCommitteeMemberById = async (req, res) => {
  try {
    const member = await CommitteeMember.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new committee member
// @route   POST /api/committee
// @access  Private/Admin
const createCommitteeMember = async (req, res) => {
  try {
    const { name, designation, header, message, order } = req.body;

    if (!name || !designation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide committee member name and designation' 
      });
    }

    // Capture file path if uploaded
    let photo = 'assets/images/default_teacher.png';
    if (req.file) {
      photo = `uploads/${req.file.filename}`;
    }

    const member = await CommitteeMember.create({
      name,
      designation,
      header: header || 'সদস্য',
      message: message || '',
      order: order ? parseInt(order, 10) : 0,
      photo
    });

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update committee member
// @route   PUT /api/committee/:id
// @access  Private/Admin
const updateCommitteeMember = async (req, res) => {
  try {
    const member = await CommitteeMember.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found' });
    }

    const updateFields = { ...req.body };

    // Handle photo replacement if new file uploaded
    if (req.file) {
      // Delete old photo if it is a local upload
      if (member.photo && member.photo.startsWith('uploads/')) {
        const oldPhotoPath = path.join(__dirname, '../', member.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      updateFields.photo = `uploads/${req.file.filename}`;
    }

    if (updateFields.order) {
      updateFields.order = parseInt(updateFields.order, 10);
    }

    await member.update(updateFields);

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete committee member
// @route   DELETE /api/committee/:id
// @access  Private/Admin
const deleteCommitteeMember = async (req, res) => {
  try {
    const member = await CommitteeMember.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Committee member not found' });
    }

    // Delete photo from disk if it was an uploaded file
    if (member.photo && member.photo.startsWith('uploads/')) {
      const photoPath = path.join(__dirname, '../', member.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await member.destroy();

    res.json({ success: true, message: 'Committee member removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCommitteeMembers,
  getCommitteeMemberById,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember
};
