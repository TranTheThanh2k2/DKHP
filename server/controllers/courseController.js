const Course = require('../models/course');
const Semester = require('../models/semester');
const Department = require('../models/department');
const mongoose = require('mongoose');
const ClassRegistration = require('../models/ClassRegistration');

// Lấy chi tiết khóa học theo ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Không tìm thấy khóa học' });
    }
    res.status(200).json(course);
    console.log(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCoursesBySemester = async (req, res) => {
  try {
    const { studentId, semesterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(semesterId)) {
      return res.status(400).json({ success: false, message: 'StudentId hoặc SemesterId không hợp lệ' });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const semesterObjectId = new mongoose.Types.ObjectId(semesterId);

    // Tìm các đăng ký lớp học của sinh viên trong học kỳ cụ thể
    const registeredClasses = await ClassRegistration.find({ studentId: studentObjectId, semesterId: semesterObjectId })
      .populate({
        path: 'courseId',
        select: 'Course_Name Credit_Hours'
      });
    if (!registeredClasses || registeredClasses.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học đã đăng ký' });
    }

    const courses = registeredClasses.map(registration => registration.courseId);
    const totalCredits = courses.reduce((acc, course) => acc + course.creditHours, 0);

    res.status(200).json({ success: true, courses, totalCredits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách môn học' });
  }
};

exports.getCoursesBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const courses = await Course.find({ Semester_ID: semesterId });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createCourse = async (req, res) => {
  try {
    const { Semester_ID, Department_Code, ...courseData } = req.body;
    const semester = await Semester.findById(Semester_ID);
    const department = await Department.findById(Department_Code);

    if (!semester) {
      return res.status(400).json({ error: 'Semester_ID không hợp lệ' });
    }

    if (!department) {
      return res.status(400).json({ error: 'Department_Code không hợp lệ' });
    }
    const existingCourse = await Course.findOne({ Semester_ID, Department_Code, ...courseData });

    if (existingCourse) {
      return res.status(400).json({ error: 'Môn học đã tồn tại' });
    }

    const course = new Course({ ...courseData, Semester_ID, Department_Code });
    await course.save();
    res.status(201).json({ message: 'Môn học đã được tạo thành công' });
    console.log(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;
    await Course.findByIdAndUpdate(id, updatedCourseData);
    res.status(200).json({ message: 'Thông tin môn học đã được cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: 'Môn học đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCoursesDetails = async (req, res) => {
  try {
    const courseIds = req.query.courseIds.split(','); 
    const courses = await Course.find({ _id: { $in: courseIds } }); 
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
