
const express = require('express');
const router = express.Router();
const courseRegistrationController = require('../controllers/courseRegistrationController');

router.post('/register', courseRegistrationController.registerCourse);

module.exports = router;
