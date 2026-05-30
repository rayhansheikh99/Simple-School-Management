const Result = require('../models/Result');

// @desc    Search dynamic report card
// @route   GET /api/results/search
// @access  Public
const searchResult = async (req, res) => {
  const { roll, class: className, examType, year } = req.query;

  if (!roll || !className || !examType || !year) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide roll, class, examType, and year for the search' 
    });
  }

  try {
    const result = await Result.findOne({
      roll: parseInt(roll, 10),
      class: className,
      examType,
      year: parseInt(year, 10)
    });

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'No result found for the specified credentials. Please check and try again.' 
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get academic result statistics summary for a given exam & class & year
// @route   GET /api/results/summary
// @access  Public
const getResultsSummary = async (req, res) => {
  const { class: className, examType, year } = req.query;

  if (!className || !examType || !year) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide class, examType, and year to fetch stats summary' 
    });
  }

  try {
    const filter = {
      class: className,
      examType,
      year: parseInt(year, 10)
    };

    const results = await Result.find(filter);

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No matching results found to build statistics' 
      });
    }

    const totalStudents = results.length;
    let passedCount = 0;
    let aPlusCount = 0;
    let aCount = 0;
    let aMinusCount = 0;
    let gpaSum = 0;

    results.forEach(res => {
      gpaSum += res.gpa;
      if (res.gpa >= 1.0) passedCount++;
      if (res.grade === 'A+') aPlusCount++;
      else if (res.grade === 'A') aCount++;
      else if (res.grade === 'A-') aMinusCount++;
    });

    const passRate = ((passedCount / totalStudents) * 100).toFixed(2);
    const avgGpa = (gpaSum / totalStudents).toFixed(2);

    res.json({
      success: true,
      summary: {
        totalStudents,
        passedCount,
        passRate: parseFloat(passRate),
        avgGpa: parseFloat(avgGpa),
        grades: {
          aPlus: aPlusCount,
          a: aCount,
          aMinus: aMinusCount,
          others: totalStudents - (aPlusCount + aCount + aMinusCount)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public results (optionally filtered by class)
// @route   GET /api/results/public
// @access  Public
const getPublicResults = async (req, res) => {
  try {
    const { class: className } = req.query;
    const filter = {};
    if (className && className !== 'all') {
      filter.class = className;
    }
    const results = await Result.find(filter).sort({ roll: 1 });
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add single result record
// @route   POST /api/results
// @access  Private/Admin
const createResult = async (req, res) => {
  try {
    const { studentName, roll, class: className, section, department, examType, year, totalMarks, grade, gpa } = req.body;

    if (!studentName || !roll || !className || !examType || !year) {
      return res.status(400).json({ success: false, message: 'Please fill all required student result fields' });
    }

    // Check for existing result to avoid collision index
    const exists = await Result.findOne({ roll, class: className, examType, year });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Result already exists for this Student Roll and Class in the given exam & year' });
    }

    const result = await Result.create({
      studentName,
      roll: parseInt(roll, 10),
      class: className,
      section: section || 'A',
      department: department || 'none',
      examType,
      year: parseInt(year, 10),
      totalMarks: totalMarks ? parseInt(totalMarks, 10) : 0,
      grade: grade || 'F',
      gpa: gpa ? parseFloat(gpa) : 0.0
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk upload results (Array of JSON items)
// @route   POST /api/results/bulk
// @access  Private/Admin
const bulkUploadResults = async (req, res) => {
  const { resultsList } = req.body;

  if (!resultsList || !Array.isArray(resultsList)) {
    return res.status(400).json({ success: false, message: 'Please provide a resultsList array in the request body' });
  }

  try {
    const operations = resultsList.map(item => ({
      updateOne: {
        filter: {
          roll: parseInt(item.roll, 10),
          class: item.class,
          examType: item.examType,
          year: parseInt(item.year, 10)
        },
        update: {
          $set: {
            studentName: item.studentName,
            section: item.section || 'A',
            department: item.department || 'none',
            totalMarks: item.totalMarks ? parseInt(item.totalMarks, 10) : 0,
            grade: item.grade || 'F',
            gpa: item.gpa ? parseFloat(item.gpa) : 0.0
          }
        },
        upsert: true // Creates the record if it does not exist, updates it if it does
      }
    }));

    const bulkWriteResult = await Result.bulkWrite(operations);

    res.json({
      success: true,
      message: `Successfully processed bulk upload of ${resultsList.length} records.`,
      details: {
        matchedCount: bulkWriteResult.matchedCount,
        modifiedCount: bulkWriteResult.modifiedCount,
        upsertedCount: bulkWriteResult.upsertedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all results
// @route   GET /api/results
// @access  Private/Admin
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find({});
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
      return res.status(404).json({ success: false, message: 'ফলাফলটি খুঁজে পাওয়া যায়নি।' });
    }
    await Result.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'ফলাফলটি সফলভাবে মুছে ফেলা হয়েছে।' });
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
