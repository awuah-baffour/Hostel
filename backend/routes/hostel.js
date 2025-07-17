const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

router.get('/', hostelController.getHostels);
router.get('/:id', hostelController.getHostelById);

module.exports = router;