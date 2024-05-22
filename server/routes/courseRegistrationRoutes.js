
const express = require('express');
const router = express.Router();
const courseRegistrationController = require('../controllers/courseRegistrationController');


router.post('/register', courseRegistrationController.registerCourse);

router.post('/registeredCoursesBySemester', courseRegistrationController.getRegisteredCoursesBySemester);

router.delete('/cancelRegistration', courseRegistrationController.cancelCourseRegistration);


module.exports = router;
