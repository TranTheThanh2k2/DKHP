const { default: mongoose } = require('mongoose');
const ClassRegistration = require('../models/ClassRegistration');
const Class = require('../models/class');

exports.getClassSchedulesBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const registeredClasses = await ClassRegistration.find({ semesterId }).populate({
      path: 'classId',

    });
    console.log(registeredClasses);
    const schedulesByDay = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    registeredClasses.forEach((registration) => {
      if (registration.classId && registration.classId.schedule) {
        const { schedule } = registration.classId;
        console.log(schedule);
      }
    });

    res.status(200).json({ success: true, schedulesByDay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy lịch học của các lớp đăng ký trong học kỳ' });
  }
};

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
    const existingRegistration = await ClassRegistration.findOne({ studentId, courseId, semesterId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Sinh viên đã đăng ký lớp học thuộc môn học này trong học kỳ này' });
    }
    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học' });
    }

    if (classInfo.status !== 'đã mở lớp') {
      return res.status(400).json({ message: 'Lớp học không ở trạng thái đã mở lớp' });
    }
    const registeredStudents = await ClassRegistration.countDocuments({ classId, semesterId });
    if (registeredStudents >= classInfo.Max_Students) {
      return res.status(400).json({ message: 'Lớp học đã đầy, không thể đăng ký' });
    }
    const registration = new ClassRegistration({ studentId, classId, courseId, semesterId });
    const savedRegistration = await registration.save();

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
