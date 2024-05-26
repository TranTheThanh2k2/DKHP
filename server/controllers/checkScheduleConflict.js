// Import Class model
const Class = require('../models/class');

// Function to check for schedule conflict
const checkScheduleConflict = async (newClass) => {
  try {
    // Truy vấn tất cả các lớp học có cùng courseId và semesterId với lớp học mới
    const existingClasses = await Class.find({ courseId: newClass.courseId, semesterId: newClass.semesterId });

    // Duyệt qua từng lớp học đã có và kiểm tra lịch học có trùng không
    for (const existingClass of existingClasses) {
      // Kiểm tra trùng ngày và khung giờ
      if (
        existingClass.schedule.dayOfWeek === newClass.schedule.dayOfWeek &&
        existingClass.schedule.timeSlot === newClass.schedule.timeSlot
      ) {
        return true; // Trùng lịch học
      }
    }

    return false; // Không trùng lịch học
  } catch (error) {
    console.error(error);
    throw new Error('Đã xảy ra lỗi khi kiểm tra lịch học trùng.');
  }
};

module.exports = checkScheduleConflict;
