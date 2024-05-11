const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Tạo mới môn học
router.post('/', courseController.createCourse);

// Lấy danh sách khóa học
router.get('/', courseController.getCourses);
// Cập nhật thông tin môn học
router.put('/:id', courseController.updateCourse);

// Xóa môn học
router.delete('/:id', courseController.deleteCourse);
module.exports = router;
