const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getSettings)
  .post(
    protect,
    adminOnly,
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 }
    ]),
    updateSettings
  );

module.exports = router;
