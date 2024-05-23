const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  Course_ID: { type: String, required: true, unique: true },
  Course_Name: { type: String, required: true },
  Credit_Hours: { type: Number, required: true },
  Department_Code: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  Semester_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true }
});
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
