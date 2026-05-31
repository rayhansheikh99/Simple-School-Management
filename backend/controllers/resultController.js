const Result = require('../models/Result');
const fs = require('fs');
const path = require('path');

// @desc    Search dynamic report card (Legacy - Deprecated)
// @route   GET /api/results/search
// @access  Public
const searchResult = async (req, res) => {
  res.status(400).json({ 
    success: false, 
    message: 'ব্যক্তিগত ফলাফল অনুসন্ধান নিষ্ক্রিয় করা হয়েছে। অনুগ্রহ করে ফলাফল তালিকা দেখুন।' 
  });
};

// @desc    Get academic result statistics summary (Legacy - Deprecated)
// @route   GET /api/results/summary
// @access  Public
const getResultsSummary = async (req, res) => {
  res.json({
    success: true,
    message: 'ফলাফল পরিসংখ্যান নিষ্ক্রিয় করা হয়েছে।'
  });
};

// @desc    Get public results (filtered by class)
// @route   GET /api/results/public
// @access  Public
const getPublicResults = async (req, res) => {
  try {
    const { class: className } = req.query;
    const filter = {};
    if (className && className !== 'all') {
      filter.class = className;
    }
    const results = await Result.find(filter).sort({ date: -1 });
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add single result notice publication
// @route   POST /api/results
// @access  Private/Admin
const createResult = async (req, res) => {
  try {
    const { title, content, class: className, year } = req.body;

    if (!title || !content || !className || !year) {
      return res.status(400).json({ success: false, message: 'দয়া করে প্রয়োজনীয় সকল তথ্য প্রদান করুন।' });
    }

    let pdfUrl = '';
    if (req.file) {
      pdfUrl = `uploads/${req.file.filename}`;
    }

    const result = await Result.create({
      title,
      content,
      class: className,
      year: parseInt(year, 10),
      pdfUrl
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk upload results (Legacy - Deprecated)
// @route   POST /api/results/bulk
// @access  Private/Admin
const bulkUploadResults = async (req, res) => {
  res.status(400).json({ success: false, message: 'বাল্ক আপলোড নিষ্ক্রিয় করা হয়েছে।' });
};

// @desc    Get all results
// @route   GET /api/results
// @access  Private/Admin
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find({}).sort({ date: -1 });
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete result record
// @route   DELETE /api/results/:id
// @access  Private/Admin
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'ফলাফল নোটিশটি খুঁজে পাওয়া যায়নি।' });
    }

    // Delete pdf from disk if it was an uploaded file
    if (result.pdfUrl && result.pdfUrl.startsWith('uploads/')) {
      const pdfPath = path.join(__dirname, '../', result.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    await Result.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'ফলাফল নোটিশটি সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchResult,
  getResultsSummary,
  getPublicResults,
  createResult,
  bulkUploadResults,
  getAllResults,
  deleteResult
};
