
const express = require('express');
const router = express.Router();
const courseRegistrationController = require('../controllers/courseRegistrationController');


router.post('/register', courseRegistrationController.registerCourse);

router.get('/registeredCoursesBySemester', courseRegistrationController.getRegisteredCoursesBySemester);

router.post('/cancelCourseRegistration', courseRegistrationController.cancelCourseRegistration);

module.exports = router;
