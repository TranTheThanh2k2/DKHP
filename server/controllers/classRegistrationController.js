const { default: mongoose } = require('mongoose');
const ClassRegistration = require('../models/ClassRegistration');
const Class = require('../models/class');
const sendEmail = require('../service/sendMail');
const Student = require('../models/student');
const Course = require('../models/course');

exports.getRegisteredClassesBySemester = async (req, res) => {
  try {
    const { studentId, semesterId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(semesterId)) {
      return res.status(400).json({ success: false, message: 'StudentId hoặc SemesterId không hợp lệ' });
    }
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const semesterObjectId = new mongoose.Types.ObjectId(semesterId);

    const registeredClasses = await ClassRegistration.find({ studentId: studentObjectId, semesterId: semesterObjectId })
      .populate({
        path: 'classId',
        select: 'Class_ID Class_Name Instructor Classroom schedule startDate endDate'
      });

    res.status(200).json({ success: true, registeredClasses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách lớp học đã đăng ký' });
  }
};
exports.registerClass = async (req, res) => {
  try {
    const { studentId, classId, courseId, semesterId } = req.body;

    // Lấy thông tin sinh viên dựa trên studentId
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin sinh viên' });
    }
    const courseInfo = await Course.findById(courseId);
    if (!courseInfo) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin môn học' });
    }
    const recipientEmail = student.Email;

    // Lấy thông tin lớp học mà sinh viên muốn đăng ký
    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học' });
    }

    // Kiểm tra trạng thái của lớp học
    if (classInfo.status !== 'đã mở lớp') {
      return res.status(400).json({ message: 'Lớp học không ở trạng thái đã mở lớp' });
    }

    // Kiểm tra trùng lặp lịch học với các lớp học đã đăng ký của sinh viên
    const existingRegistrations = await ClassRegistration.find({ studentId, semesterId }).populate('classId');
    const hasConflict = existingRegistrations.some(registration => {
      const registeredClass = registration.classId;
      return (
        registeredClass._id.toString() !== classId && // Tránh so sánh lớp hiện tại với chính nó
        registeredClass.schedule.dayOfWeek === classInfo.schedule.dayOfWeek &&
        registeredClass.schedule.timeSlot === classInfo.schedule.timeSlot
      );
    });

    if (hasConflict) {
      return res.status(400).json({ message: 'Lịch học của lớp này trùng với một lớp khác đã đăng ký' });
    }

    const registeredStudentsCount = await ClassRegistration.countDocuments({ classId, semesterId });
    if (registeredStudentsCount >= classInfo.Max_Students) {
      return res.status(400).json({ message: 'Lớp học đã đầy, không thể đăng ký' });
    }


    const registration = new ClassRegistration({ studentId, classId, courseId, semesterId });
    const savedRegistration = await registration.save();
    const courseFee = courseInfo.Credit_Hours * 900000;
    const emailSubject = 'Đăng ký lớp học thành công';
    const emailText = `Bạn đã đăng ký một lớp học thành công.\n
                      Thông tin môn học:\n
                      Tên môn học: ${courseInfo.Course_Name}\n
                      Số tín chỉ: ${courseInfo.Credit_Hours}\n
                      Số tiền phải đóng: ${courseFee.toLocaleString()} VND\n`;
    await sendEmail(recipientEmail, emailSubject, emailText);

    // Trả về kết quả thành công
    res.status(201).json({ message: 'Đăng ký lớp học thành công', savedRegistration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký lớp học' });
  }
};

exports.cancelRegistrationById = async (req, res) => {
    try {
      const { registrationId } = req.params;
  
      // Tìm và xóa đăng ký lớp học dựa trên ID của đăng ký
      const deletedRegistration = await ClassRegistration.findByIdAndDelete(registrationId);
  
      if (!deletedRegistration) {
        return res.status(404).json({ message: 'Không tìm thấy đăng ký lớp học' });
      }
  
      res.status(200).json({ message: 'Đã hủy đăng ký lớp học thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy đăng ký lớp học' });
    }
};
