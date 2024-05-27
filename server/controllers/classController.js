const Class = require("../models/class");

const getClassSchedule = async (req, res) => {
  try {
    const classId = req.params.classId;
    const classDetails = await Class.findOne({ _id: classId }, 'schedule');
    if (!classDetails) {
      return res.status(404).json({ message: 'Lớp học không được tìm thấy' });
    }
    res.status(200).json(classDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
const getClassDetails = async (req, res) => {
    try {
      const classId = req.params.classId;
      const classDetails = await Class.findOne({ _id: classId });
      if (!classDetails) {
        return res.status(404).json({ message: 'Lớp học không được tìm thấy' });
      }
      res.status(200).json(classDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

const getClassesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const classes = await Class.find({ courseId });

    if (!classes || classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học cho khóa học này",
      });
    }

    res.status(200).json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};

const addClass = async (req, res) => {
  try {
    const { Class_ID, Class_Name, Instructor, Classroom, Max_Students, courseId, status, startDate, endDate, schedule } = req.body;

    // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu
    if (startDate && endDate && endDate < startDate) {
      return res.status(400).json({ message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu' });
    }

    const newClass = new Class({
      Class_ID,
      Class_Name,
      Instructor,
      Classroom,
      Max_Students,
      courseId,
      status,
      startDate,
      endDate,
      schedule
    });

    await newClass.save();
    res.status(201).json({ message: 'Lớp học đã được thêm thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm lớp học.', error });
  }
};
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lớp học đã được xóa thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { Class_ID, Class_Name, Instructor, Classroom, Max_Students, courseId, status, startDate, endDate, schedule } = req.body;

    // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu
    if (startDate && endDate && endDate < startDate) {
      return res.status(400).json({ message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu' });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { Class_ID, Class_Name, Instructor, Classroom, Max_Students, courseId, status, startDate, endDate, schedule },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lớp học đã được cập nhật thành công",
      updatedClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};

const getAllClasses = async (req, res) => {
  try {
    
    const classes = await Class.find();
    
    if (!classes || classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.status(200).json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};
module.exports = {
  getClassesByCourse,
  addClass,
  deleteClass,
  updateClass,
  getClassDetails,
  getAllClasses,
  getClassSchedule,
};
