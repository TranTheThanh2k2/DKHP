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
    status: "chờ sinh viên đăng kí",
    startDate: "",
    endDate: "",
    dayOfWeek: "", // Thêm trường dayOfWeek vào classData
    timeSlot: "", // Thêm trường timeSlot vào classData
  });
  const [courses, setCourses] = useState([]);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách môn học", error);
      }
    };

    const fetchClassList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/getAllClasses"
        );
        setClassList(response.data.classes);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách lớp học", error);
      }
    };

    fetchCourses();
    fetchClassList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/addClass", {
        ...classData,
        schedule: {
          dayOfWeek: classData.dayOfWeek,
          timeSlot: classData.timeSlot,
        },
      });
      enqueueSnackbar(response.data.message, { variant: "success" });
      setClassList([...classList, response.data.class]);
      resetFormData();
    } catch (error) {
      enqueueSnackbar("Có lỗi xảy ra khi thêm lớp học.", { variant: "error" });
      console.error(error);
    }
  };
  const resetFormData = () => {
    setClassData({
      Class_ID: "",
      Class_Name: "",
      Instructor: "",
      Classroom: "",
      Max_Students: 0,
      courseId: "",
      status: "chờ sinh viên đăng kí",
      startDate: "",
      endDate: "",
      dayOfWeek: "", // Reset trường dayOfWeek
      timeSlot: "", // Reset trường timeSlot
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/deleteClass/${id}`);
      setClassList(classList.filter((classItem) => classItem._id !== id));
      enqueueSnackbar("Xóa lớp học thành công.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Có lỗi xảy ra khi xóa lớp học.", { variant: "error" });
      console.error(error);
    }
  };

  const handleUpdate = async (classItem) => {
    try {
      const validStatuses = ["chờ sinh viên đăng kí", "đã mở lớp", "đã khóa"];
      const updatedStatus = validStatuses.includes(classItem.status)
        ? classItem.status
        : "chờ sinh viên đăng kí";

      const updatedClass = { ...classItem, status: updatedStatus };

      const response = await axios.put(
        `http://localhost:3000/api/updateClass/${classItem._id}`,
        updatedClass
      );

      // Update form data after successful update
      setClassData({
        ...classData,
        ...response.data.updatedClass, // Use updated data from API to update form
      });

      // Update class list after successful update
      const updatedClassList = classList.map((item) =>
        item._id === classItem._id ? response.data.updatedClass : item
      );
      setClassList(updatedClassList);

      enqueueSnackbar("Cập nhật lớp học thành công.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Có lỗi xảy ra khi cập nhật lớp học.", {
        variant: "error",
      });
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Thêm Lớp Học</h2>
        <div>
          <label>Mã Lớp Học:</label>
          <input
            type="text"
            name="Class_ID"
            value={classData.Class_ID}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tên Lớp Học:</label>
          <input
            type="text"
            name="Class_Name"
            value={classData.Class_Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Giảng Viên:</label>
          <input
            type="text"
            name="Instructor"
            value={classData.Instructor}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phòng Học:</label>
          <input
            type="text"
            name="Classroom"
            value={classData.Classroom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Sỉ Số:</label>
          <input
            type="number"
            name="Max_Students"
            value={classData.Max_Students}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Môn Học:</label>
          <select
            name="courseId"
            value={classData.courseId}
            onChange={handleChange}
            required
          >
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
          <select
            name="status"
            value={classData.status}
            onChange={handleChange}
          >
            <option value="chờ sinh viên đăng kí">Chờ Sinh Viên Đăng Kí</option>
            <option value="đã mở lớp">Đã Mở Lớp</option>
            <option value="đã khóa">Đã Khóa</option>
          </select>
        </div>
        <div>
          <label>Ngày Bắt Đầu:</label>
          <input
            type="date"
            name="startDate"
            value={classData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ngày Kết Thúc:</label>
          <input
            type="date"
            name="endDate"
            value={classData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ngày Học:</label>
          <select
            name="dayOfWeek"
            value={classData.dayOfWeek}
            onChange={handleChange} // Thay đổi handleChange thành handleScheduleChange
            required
          >
            <option value="">-- Chọn Ngày Học --</option>
            <option value="Monday">Thứ Hai</option>
            <option value="Tuesday">Thứ Ba</option>
            <option value="Wednesday">Thứ Tư</option>
            <option value="Thursday">Thứ Năm</option>
            <option value="Friday">Thứ Sáu</option>
            <option value="Saturday">Thứ Bảy</option>
            <option value="Sunday">Chủ Nhật</option>
          </select>
        </div>
        <div>
          <label>Thời Gian Học:</label>
          <select
            name="timeSlot"
            value={classData.timeSlot}
            onChange={handleChange} // Thay đổi handleChange thành handleScheduleChange
          >
            <option value="">-- Chọn Thời Gian Học --</option>
            <option value="1-3">1-3</option>
            <option value="4-6">4-6</option>
            <option value="7-9">7-9</option>
            <option value="10-12">10-12</option>
          </select>
        </div>
        <button type="submit">Thêm Lớp Học</button>
      </form>

      <div>
        <h2>Danh Sách Lớp Học</h2>
        <table>
          <thead>
            <tr>
              <th>Tên Lớp Học</th>
              <th>Mã Lớp</th>
              <th>Giảng Viên</th>
              <th>Phòng Học</th>
              <th>Sỉ Số</th>
              <th>Môn Học</th>
              <th>Trạng Thái</th>
              <th>Ngày Bắt Đầu</th>
              <th>Ngày Kết Thúc</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {classList.map((classItem) =>
              classItem ? (
                <tr key={classItem._id}>
                  <td>{classItem.Class_Name}</td>
                  <td>{classItem.Class_ID}</td>
                  <td>{classItem.Instructor}</td>
                  <td>{classItem.Classroom}</td>
                  <td>{classItem.Max_Students}</td>
                  <td>{classItem.courseId}</td>
                  <td>{classItem.status}</td>
                  <td>{classItem.startDate}</td>
                  <td>{classItem.endDate}</td>
                  <td>
                    <button onClick={() => handleUpdate(classItem)}>
                      Cập Nhật
                    </button>
                    <button onClick={() => handleDelete(classItem._id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassForm;
