
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
