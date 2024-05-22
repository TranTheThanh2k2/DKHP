
const CourseRegistration = require('../models/CourseRegistration');

exports.registerCourse = async (req, res) => {
  try {
    const existingRegistration = await CourseRegistration.findOne({
      studentId: req.body.studentId,
      courseId: req.body.courseId,
      semesterId: req.body.semesterId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Sinh viên đã đăng kí môn học này cho học kì này' });
    }
    const registration = new CourseRegistration({
      studentId: req.body.studentId,
      courseId: req.body.courseId,
      semesterId: req.body.semesterId,
    });
    
    const savedRegistration = await registration.save();
    res.status(201).json({ message: 'Đăng kí môn học thành công!', savedRegistration });
    console.log(savedRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getRegisteredCoursesBySemester = async (req, res) => {
  try {
    const { studentId, semesterId } = req.body;

    // Tìm tất cả các bản ghi đăng ký môn học của sinh viên cho học kì đã chỉ định
    const registeredCourses = await CourseRegistration.find({
      studentId: studentId,
      semesterId: semesterId,
    });

    res.status(200).json(registeredCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.cancelCourseRegistration = async (req, res) => {
  try {
    const { studentId, courseId, semesterId } = req.body;

    // Tìm bản ghi đăng ký môn học cần hủy
    const registration = await CourseRegistration.findOneAndDelete({
      studentId: studentId,
      courseId: courseId,
      semesterId: semesterId,
    });

    if (!registration) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi đăng ký môn học' });
    }

    res.status(200).json({ message: 'Hủy môn học thành công!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};