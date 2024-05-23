const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  Class_ID: {
    type: String,
    required: true,
  },
  Class_Name: {
    type: String,
    required: true,
  },
  Instructor: {
    type: String,
    required: true,
  },
  Classroom: {
    type: String,
    required: true,
  },
  Max_Students: {
    type: Number,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  status: {
    type: String,
    enum: ["chờ sinh viên đăng kí", "đã mở lớp", "đã khóa"],
    default: "chờ sinh viên đăng kí"
  }
});

module.exports = mongoose.model("Class", classSchema);