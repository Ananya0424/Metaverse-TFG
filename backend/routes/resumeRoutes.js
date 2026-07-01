const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

// Multer config - store file in memory for parsing
const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', protect, upload.single('resume'), parseResume);

module.exports = router;
