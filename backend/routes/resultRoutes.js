const express = require('express');
const router = express.Router();
const {
  searchResult,
  getResultsSummary,
  getPublicResults,
  createResult,
  bulkUploadResults,
  getAllResults,
  deleteResult
} = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/search', searchResult);
router.get('/summary', getResultsSummary);
router.get('/public', getPublicResults);

router.route('/')
  .get(protect, getAllResults)
  .post(protect, adminOnly, createResult);

router.route('/:id')
  .delete(protect, adminOnly, deleteResult);

router.post('/bulk', protect, adminOnly, bulkUploadResults);

module.exports = router;
