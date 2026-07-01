const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseResume } = require('../controllers/resumeController');

// Multer config - store file in memory for parsing
const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', upload.single('resume'), parseResume);

module.exports = router;
