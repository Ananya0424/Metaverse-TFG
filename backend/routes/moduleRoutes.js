const express = require('express');
const router = express.Router();
const { getModules, getModuleById } = require('../controllers/modulesController');
const { protect } = require('../middleware/auth');

router.route('/').get(getModules);
router.route('/:id').get(getModuleById);

module.exports = router;
