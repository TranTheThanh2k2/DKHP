// controllers/studentController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');
const Student = require('../models/student');

exports.createUserAndStudent = async (req, res) => {
    try {
      const { email, password, studentInfo, isAdmin } = req.body;
      if (!isAdmin) {
        // Nếu không phải là admin, tạo cả user và student
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Băm mật khẩu
        const newUser = new User({ email, password: hashedPassword });
        const user = await newUser.save();
        const newStudent = new Student({ ...studentInfo, userId: user._id });
        await newStudent.save();
        console.log(newStudent);
        return res.status(201).json({ message: 'Người dùng và sinh viên đã được tạo thành công' });
      } else {
        // Nếu là admin, chỉ tạo user và không cần tạo student
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Băm mật khẩu
        const newUser = new User({ email, password: hashedPassword, isAdmin });
        await newUser.save();
        return res.status(201).json({ message: 'Người dùng đã được tạo thành công' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudentData = req.body;
    await Student.findByIdAndUpdate(id, updatedStudentData);
    res.status(200).json({ message: 'Thông tin sinh viên đã được cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserAndStudent = async (req, res) => {
    try {
      const { id } = req.params;
      // Xóa người dùng
      await User.findByIdAndDelete(id);
      // Xóa sinh viên liên kết với người dùng
      await Student.findOneAndDelete({ userId: id });
      res.status(200).json({ message: 'Người dùng và sinh viên đã được xóa thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // Đăng nhập
// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Tìm người dùng dựa trên email
    const user = await User.findOne({ email });
    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    // Lấy giá trị isAdmin từ cơ sở dữ liệu
    const isAdmin = user.isAdmin;
    // Nếu người dùng là sinh viên, lấy studentId từ cơ sở dữ liệu và thêm vào token JWT
    let studentId;
    if (!isAdmin) {
      const student = await Student.findOne({ userId: user._id });
      studentId = student._id; // Giả sử studentId được lấy từ một trường trong bảng Student
    }
    // Tạo token JWT
    const secretKey = '1234'; 
    const token = jwt.sign({ userId: user._id, isAdmin, studentId }, secretKey, { expiresIn: '1h' });
    // Trả về token, trường isAdmin và studentId (nếu có)
    res.status(200).json({ token, isAdmin, studentId });
    console.log(token);
    console.log(studentId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

// Lấy tất cả người dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
