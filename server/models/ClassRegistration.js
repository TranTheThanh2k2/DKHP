const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassRegistrationSchema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
}, { timestamps: true });

// Tạo model từ schema
const ClassRegistration = mongoose.model('ClassRegistration', ClassRegistrationSchema);

module.exports = ClassRegistration;
