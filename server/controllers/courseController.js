const Course = require('../models/course');
const Semester = require('../models/semester');
const Department = require('../models/department');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { Semester_ID, Department_Code, ...courseData } = req.body;
    
    // Kiểm tra xem semester_id và department_code có hợp lệ không
    const semester = await Semester.findById(Semester_ID);
    const department = await Department.findById(Department_Code);

    if (!semester) {
      return res.status(400).json({ error: 'Semester_ID không hợp lệ' });
    }

    if (!department) {
      return res.status(400).json({ error: 'Department_Code không hợp lệ' });
    }

    const course = new Course({ ...courseData, Semester_ID, Department_Code });
    await course.save();
    res.status(201).json({ message: 'Môn học đã được tạo thành công' });
    console.log(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;
    await Course.findByIdAndUpdate(id, updatedCourseData);
    res.status(200).json({ message: 'Thông tin môn học đã được cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: 'Môn học đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
