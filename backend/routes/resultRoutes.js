const express = require('express');
const router = express.Router();
const {
  searchResult,
  getResultsSummary,
  createResult,
  bulkUploadResults,
  getAllResults,
  deleteResult
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', searchResult);
router.get('/summary', getResultsSummary);

router.route('/')
  .get(protect, getAllResults)
  .post(protect, createResult);

router.route('/:id')
  .delete(protect, deleteResult);

router.post('/bulk', protect, bulkUploadResults);

module.exports = router;
