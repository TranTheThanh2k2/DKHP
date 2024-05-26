const express = require('express');
const router = express.Router();
const classRegistrationController = require('../controllers/classRegistrationController');

// Đăng ký lớp học
router.post('/register', classRegistrationController.registerClass);
// router.get("/schedules/:semesterId",classRegistrationController.getClassSchedulesBySemester);
// Hủy đăng ký lớp học
router.delete('/cancel/:registrationId', classRegistrationController.cancelRegistrationById);
router.get('/registered-classes/:studentId/:semesterId', classRegistrationController.getRegisteredClassesBySemester);

module.exports = router;
