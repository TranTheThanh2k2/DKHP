// models/CourseRegistration.js
const mongoose = require('mongoose');

const CourseRegistrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
});

const CourseRegistration = mongoose.model('CourseRegistration', CourseRegistrationSchema);

module.exports = CourseRegistration;
