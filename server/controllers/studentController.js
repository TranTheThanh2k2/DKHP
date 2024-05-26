const Student = require('../models/student');

const mongoose = require('mongoose');
const ClassRegistration = require('../models/ClassRegistration');
const Course = require('../models/course');

exports.getAllRegisteredCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: 'StudentId không hợp lệ' });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Tìm các đăng ký lớp học của sinh viên
    const registeredClasses = await ClassRegistration.find({ studentId: studentObjectId })
      .populate({
        path: 'courseId',
        select: 'Course_Name Credit_Hours'
      });

    if (!registeredClasses || registeredClasses.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học nào' });
    }

    // Tạo danh sách các môn học đã đăng ký
    const registeredCourses = registeredClasses.map(registration => ({
      courseId: registration.courseId._id,
      Course_Name: registration.courseId.Course_Name,
      Credit_Hours: registration.courseId.Credit_Hours
    }));

    // Đếm tổng số tín chỉ
    const totalCreditHours = registeredCourses.reduce((total, course) => total + course.Credit_Hours, 0);

    res.status(200).json({ success: true, registeredCourses, totalCreditHours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách môn học đã đăng ký' });
  }
};

// Controller để tạo sinh viên mới
exports.createStudent = async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        student: newStudent
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Controller để lấy thông tin của một sinh viên dựa trên ID
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        student
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Sinh viên không được tìm thấy'
    });
  }
};

// Controller để cập nhật thông tin của một sinh viên
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        student
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Controller để xóa một sinh viên
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Sinh viên không được tìm thấy'
    });
  }
};
