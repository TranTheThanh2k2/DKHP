import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const ClassForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [classData, setClassData] = useState({
    Class_ID: "",
    Class_Name: "",
    Instructor: "",
    Classroom: "",
    Max_Students: 0,
    courseId: "",
    status: "chờ sinh viên đăng kí"
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách môn học", error);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/addClass", classData);
      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Có lỗi xảy ra khi thêm lớp học.", { variant: "error" });
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm Lớp Học</h2>
      <div>
        <label>Mã Lớp Học:</label>
        <input type="text" name="Class_ID" value={classData.Class_ID} onChange={handleChange} required />
      </div>
      <div>
        <label>Tên Lớp Học:</label>
        <input type="text" name="Class_Name" value={classData.Class_Name} onChange={handleChange} required />
      </div>
      <div>
        <label>Giảng Viên:</label>
        <input type="text" name="Instructor" value={classData.Instructor} onChange={handleChange} required />
      </div>
      <div>
        <label>Phòng Học:</label>
        <input type="text" name="Classroom" value={classData.Classroom} onChange={handleChange} required />
      </div>
      <div>
        <label>Sỉ Số:</label>
        <input type="number" name="Max_Students" value={classData.Max_Students} onChange={handleChange} required />
      </div>
      <div>
        <label>Mã Môn Học:</label>
        <select name="courseId" value={classData.courseId} onChange={handleChange} required>
          <option value="">-- Chọn Môn Học --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.Course_Name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Trạng Thái:</label>
        <select name="status" value={classData.status} onChange={handleChange}>
          <option value="chờ sinh viên đăng kí">Chờ Sinh Viên Đăng Kí</option>
          <option value="đã mở lớp">Đã Mở Lớp</option>
          <option value="đã khóa">Đã Khóa</option>
        </select>
      </div>
      <button type="submit">Thêm Lớp Học</button>
    </form>
  );
};

export default ClassForm;
