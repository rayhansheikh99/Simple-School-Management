const StudentRegistration = require('../models/StudentRegistration');

// @desc    Submit a new student registration application
// @route   POST /api/registrations
// @access  Public
const submitRegistration = async (req, res) => {
  const {
    studentName, fatherName, motherName, dateOfBirth,
    gender, desiredClass, desiredGroup, phone, email, address, previousSchool
  } = req.body;

  // Validate required fields
  if (!studentName || !fatherName || !motherName || !dateOfBirth || !gender || !desiredClass || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: 'সকল আবশ্যক ক্ষেত্র পূরণ করুন।'
    });
  }

  try {
    const registrationData = {
      studentName,
      fatherName,
      motherName,
      dateOfBirth,
      gender,
      desiredClass,
      desiredGroup: desiredGroup || '',
      phone,
      email: email || '',
      address,
      previousSchool: previousSchool || '',
    };

    // Handle photo upload if present
    if (req.file) {
      registrationData.photo = `uploads/${req.file.filename}`;
    }

    const registration = await StudentRegistration.create(registrationData);

    res.status(201).json({
      success: true,
      message: 'আপনার ভর্তি আবেদনটি সফলভাবে জমা হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।',
      data: registration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registration applications
// @route   GET /api/registrations
// @access  Private/Admin
const getRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const registrations = await StudentRegistration.findAll({
      where: filter,
      order: [['submittedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update registration status (approve/reject)
// @route   PUT /api/registrations/:id
// @access  Private/Admin
const updateRegistrationStatus = async (req, res) => {
  const { status } = req.body;

  if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'অনুগ্রহ করে একটি বৈধ স্ট্যাটাস প্রদান করুন (pending/approved/rejected)।'
    });
  }

  try {
    const registration = await StudentRegistration.findByPk(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'আবেদনটি খুঁজে পাওয়া যায়নি।' });
    }

    await registration.update({ status });

    res.json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a registration
// @route   DELETE /api/registrations/:id
// @access  Private/Admin
const deleteRegistration = async (req, res) => {
  try {
    const registration = await StudentRegistration.findByPk(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'আবেদনটি খুঁজে পাওয়া যায়নি।' });
    }

    await registration.destroy();

    res.json({ success: true, message: 'আবেদনটি সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitRegistration,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration
};
