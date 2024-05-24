const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Tạo mới môn học
router.post('/', courseController.createCourse);


router.get('/', courseController.getCourses);

router.get('/:id', courseController.getCourseById);

router.get('/:semesterId/courses', courseController.getCoursesBySemester);

router.get('/details', courseController.getCoursesDetails);

// Cập nhật thông tin môn học
router.put('/:id', courseController.updateCourse);

// Xóa môn học
router.delete('/:id', courseController.deleteCourse);
module.exports = router;
