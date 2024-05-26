const ClassRegistration = require('../models/ClassRegistration');
const Class = require('../models/class');

exports.getClassSchedulesBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;

    // Tìm tất cả các lớp đăng ký trong học kỳ và populate thông tin lớp học
    const registeredClasses = await ClassRegistration.find({ semesterId }).populate('classId');
    console.log('Registered Classes:', registeredClasses); // Kiểm tra dữ liệu đã populate

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
      console.log('Registration:', registration);
      if (registration.classId && registration.classId.schedule) {
        const { schedule } = registration.classId;
        console.log('Schedule:', schedule); // In ra giá trị của schedule để kiểm tra

        // Đẩy thông tin lịch học vào mảng tương ứng trong schedulesByDay
        schedulesByDay[schedule.dayOfWeek].push({
          timeSlot: schedule.timeSlot,
          className: registration.classId.Class_Name,
          instructor: registration.classId.Instructor,
          classroom: registration.classId.Classroom,
        });
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
    const registeredClasses = await ClassRegistration.find({ studentId, semesterId }).populate('classId');
    
    res.status(200).json({ success: true, registeredClasses });
    console.log(registeredClasses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách lớp học đã đăng ký' });
  }
};

exports.registerClass = async (req, res) => {
  try {
    const { studentId, classId, courseId, semesterId } = req.body;

    // Kiểm tra xem sinh viên đã đăng ký lớp học thuộc cùng một khoá học hay chưa
    const existingRegistration = await ClassRegistration.findOne({ studentId, courseId, semesterId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Sinh viên đã đăng ký lớp học thuộc môn học này trong học kỳ này' });
    }

    // Kiểm tra xem lớp học đã đầy hay không
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

    // Tạo đăng ký lớp học mới
    const registration = new ClassRegistration({ studentId, classId, courseId, semesterId });

    // Lưu đăng ký lớp học vào cơ sở dữ liệu
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
