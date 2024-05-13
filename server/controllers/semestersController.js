const Semester = require('../models/semester');

// Lấy danh sách tất cả học kỳ
exports.getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo học kỳ mới
exports.createSemester = async (req, res) => {
  const { Semester_ID, Semester_Name, Year, Start_Date, End_Date } = req.body;
  const semester = new Semester({
    Semester_ID,
    Semester_Name,
    Year,
    Start_Date,
    End_Date
  });
  try {
    const newSemester = await semester.save();
    res.status(201).json(newSemester);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thông tin học kỳ
exports.updateSemester = async (req, res) => {
  const { id } = req.params;
  const { Semester_ID, Semester_Name, Year, Start_Date, End_Date } = req.body;
  try {
    const updatedSemester = await Semester.findByIdAndUpdate(id, {
      Semester_ID,
      Semester_Name,
      Year,
      Start_Date,
      End_Date
    }, { new: true });
    res.json(updatedSemester);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa học kỳ
exports.deleteSemester = async (req, res) => {
  const { id } = req.params;
  try {
    await Semester.findByIdAndDelete(id);
    res.json({ message: 'Semester deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
