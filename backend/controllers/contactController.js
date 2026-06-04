const ContactMessage = require('../models/ContactMessage');

// @desc    Submit contact query form
// @route   POST /api/contact
// @access  Public
const submitInquiry = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in name, email, and message fields' 
    });
  }

  try {
    const inquiry = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General school enquiry',
      message
    });

    res.status(201).json({ 
      success: true, 
      message: 'Your inquiry has been sent successfully. Thank you!',
      data: inquiry 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inbox messages
// @route   GET /api/contact/messages
// @access  Private/Admin
const getInquiries = async (req, res) => {
  try {
    const inquiries = await ContactMessage.findAll({
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update message status
// @route   PUT /api/contact/messages/:id
// @access  Private/Admin
const updateInquiryStatus = async (req, res) => {
  const { status } = req.body;

  if (!status || !['unread', 'read', 'archived'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid status update' });
  }

  try {
    const message = await ContactMessage.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await message.update({ status });

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/contact/messages/:id
// @access  Private/Admin
const deleteInquiry = async (req, res) => {
  try {
    const message = await ContactMessage.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'বার্তাটি খুঁজে পাওয়া যায়নি।' });
    }
    await message.destroy();
    res.json({ success: true, message: 'বার্তাটি সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
};
