const  Class = require("../models/class");

const getClassDetails = async (req, res) => {
    try {
      const classId = req.params.classId;
      const classDetails = await Class.findOne({ _id: classId }); // Tìm lớp học bằng _id
      if (!classDetails) {
        return res.status(404).json({ message: 'Lớp học không được tìm thấy' });
      }
      res.status(200).json(classDetails); // Trả về chi tiết của lớp học
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};


const getClassesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const classes = await Class.find({ courseId });

    if (!classes) {
      return res.status(404).json({
        success: false,
        message: "Classes not found",
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
      message: "Server error",
    });
  }
};

// Thêm lớp học mới
const addClass = async (req, res) => {
  try {
    const { Class_ID, Class_Name, Instructor, Classroom, Max_Students, courseId, status } = req.body;

    const newClass = new Class({
      Class_ID,
      Class_Name,
      Instructor,
      Classroom,
      Max_Students,
      courseId,
      status
    });

    await newClass.save();
    res.status(201).json({ message: 'Lớp học đã được thêm thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm lớp học.', error });
  }
};

// Xóa lớp học
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {z
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Cập nhật lớp học
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { Class_ID, Class_Name, Instructor, Classroom, Max_Students, courseId, status } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { Class_ID, Class_Name, Instructor, Classroom, Max_Students, courseId, status },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      updatedClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getClassesByCourse,
  addClass,
  deleteClass,
  updateClass,
  getClassDetails,
};
