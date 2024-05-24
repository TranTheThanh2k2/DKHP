const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
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
    default: "chờ sinh viên đăng kí",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  schedule: {
    dayOfWeek: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ["1-3", "4-6", "7-9", "10-12"],
      required: true,
    },
  }, 
}, { timestamps: true });

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
