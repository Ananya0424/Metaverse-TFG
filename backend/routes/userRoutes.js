const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, addMockInterview, addTrainingLog } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/').get(getAllUsers); // Allow admin to fetch all users
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/me').get(protect, getUserProfile); // Alias for Unity

router.post('/interview', protect, addMockInterview);
router.post('/training-log', protect, addTrainingLog);

module.exports = router;
