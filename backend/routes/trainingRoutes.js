const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processTextQuery, processVoiceQuery } = require('../controllers/trainingController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/text-query', processTextQuery);
router.post('/voice-query', upload.single('audio'), processVoiceQuery);

module.exports = router;
