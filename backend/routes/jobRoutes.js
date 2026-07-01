const express = require('express');
const router = express.Router();
const { getJobs, searchJobs, seedJobs, createJob } = require('../controllers/jobController');

// Route to get all jobs or jobs by page
router.get('/', getJobs);

// Route to create a new job (Admin)
router.post('/', createJob);

// Route for semantic job search
router.post('/search', searchJobs);

// Utility route to seed the initial 3 jobs if DB is empty
router.post('/seed', seedJobs);

module.exports = router;
