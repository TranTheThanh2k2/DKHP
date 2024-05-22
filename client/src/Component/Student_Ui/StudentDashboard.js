import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./style_student/Studentboard.css";

import iuh1 from "../Student_Ui/style_student/iu1.png";
import toan from "../Student_Ui/style_student/h2.jpg";

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [hiddenStudentId, setHiddenStudentId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]); // Danh sách các khóa học được chọn
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const studentIdFromStorage = localStorage.getItem("studentID");
    if (studentIdFromStorage) {
      setStudentId(studentIdFromStorage);
      setHiddenStudentId(studentIdFromStorage);
      fetchStudentDetails(studentIdFromStorage);
      fetchSemesters();
    }
  }, []);

  useEffect(() => {
    if (semesterId) {
      fetchRegisteredCourses();
    }
  }, [semesterId]);

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/students/${studentId}`
      );
      setFullName(response.data.data.student.Full_Name);
      setDepartmentCode(response.data.data.student.Department_Code);
      setGender(response.data.data.student.Gender);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/semesters`);
      setSemesters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCoursesBySemester = async (semesterId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${semesterId}/courses`
      );
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRegisteredCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/course/registeredCoursesBySemester`,
        {
          params: {
            studentId: studentId,
            semesterId: semesterId,
          },
        }
      );
      setTimeout(()=>{
        setRegisteredCourses(response.data);
      },1000)
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelRegistration = async (courseId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/course/cancelCourseRegistration",
        {
          studentId: studentId,
          courseId: courseId,
          semesterId: semesterId,
        }
      );
      setTimeout(()=>{
        enqueueSnackbar(response.data.message, { variant: "success" });
      },1000);

      // Cập nhật lại danh sách registeredCourses sau khi hủy đăng ký môn học
      fetchRegisteredCourses();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Hủy đăng ký thất bại.", { variant: "error" });
    }
  };

  const handleRegisterCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/course/register",
        {
          studentId: studentId,
          courseId: selectedCourses,
          semesterId: semesterId,
        }
      );
      setTimeout(()=>{
        enqueueSnackbar(response.data.message, { variant: "success" });
      },1000)
      fetchRegisteredCourses();
      setSelectedCourses([]);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Đăng ký thất bại.", { variant: "error" });
    }
  };

  const handleCheckboxChange = (courseId) => {
    // Kiểm tra xem courseId đã được chọn chưa
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId)); // Nếu đã được chọn, loại bỏ khóa học khỏi danh sách
    } else {
      setSelectedCourses([courseId]); // Nếu chưa được chọn, thêm khóa học vào danh sách
    }
  };
  return (
    <div>
      <div>
        <img
          src={iuh1}
          style={{
            height: "auto",
            width: "80%",
            paddingLeft: 150,
          }}
        />
      </div>
      <div className="sv">
        <div className="sv1">
          <h3>Xin Chào !</h3>
          <p>{fullName}</p>
          <p>Giới Tính : {gender}</p>
          <p>Khoa : {departmentCode} </p>
        </div>
        <div className="sv2">
          <img
            src={toan}
            style={{
              height: 150,
              width: 150,
            }}
          />
        </div>
        <div className="sv3">
          <p>THÔNG TIN SINH VIÊN</p>
          <p>ĐĂNG KÝ HỌC PHẦN</p>
          <p>CHƯƠNG TRÌNH KHUNG</p>
        </div>
      </div>
      <div className="sv4">
        <h2>ĐĂNG KÝ HỌC PHẦN</h2>
      </div>
      <div className="sv5">
        <form onSubmit={handleRegisterCourse}>
          <input type="hidden" value={hiddenStudentId} />
          <label style={{ fontSize: 20, fontWeight: "bold" }}>
            Đợt Đăng Kí
            <select
              style={{ marginLeft: 20, fontSize: 20 }}
              value={semesterId}
              onChange={(e) => {
                setSemesterId(e.target.value);
                fetchCoursesBySemester(e.target.value);
              }}
            >
              <option value="">-- Chọn học kỳ --</option>
              {semesters.map((semester) => (
                <option key={semester._id} value={semester._id}>
                  {semester.Semester_Name}
                </option>
              ))}
            </select>
          </label>
        </form>
      </div>
      <div className="sv6">
        <h2>Môn Học Phần Đang Chờ Đăng Ký</h2>
      </div>

      <table className="table-student123">
        <thead>
          <tr>
            <th>Mã Môn Học</th>
            <th>Tên Môn Học</th>
            <th>Số Tín Chỉ</th>
            <th>Đăng ký</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.Course_ID}</td>
              <td>{course.Course_Name}</td>
              <td>{course.Credit_Hours}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course._id)}
                  onChange={() => handleCheckboxChange(course._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bảng hiển thị thông tin các khóa học đã chọn */}
      <h2>Các Khóa Học Đã Chọn</h2>
      <table className="selected-courses">
        <thead>
          <tr>
            <th>Mã Môn Học</th>
            <th>Tên Môn Học</th>
            <th>Số Tín Chỉ</th>
            <th>Sỉ Số Tối Đa</th>
          </tr>
        </thead>
        <tbody>
          {selectedCourses.map((courseId) => {
            const course = courses.find((course) => course._id === courseId);
            return (
              <tr key={course._id}>
                <td>{course.Course_ID}</td>
                <td>{course.Course_Name}</td>
                <td>{course.Credit_Hours}</td>
                <td>{course.Max_Students}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        type="submit"
        onClick={handleRegisterCourse}
        style={{ marginLeft: 20, fontSize: 20 }}
      >
        Đăng Kí
      </button>

      <div>
        <h2>Danh sách môn học đã đăng ký</h2>
        <table>
          <thead>
            <tr>
              <th>Mã Môn Học</th>
              <th>Tên Môn Học</th>
              <th>Số Tín Chỉ</th>
              <th>Giảng Viên</th>
              <th>Phòng Học</th>
              <th>Học Phí</th> {/* Thêm cột học phí */}
              <th>Ngày Đăng Kí</th>
              <th>Hủy Đăng Kí</th>
              {/* Thêm các cột khác nếu cần */}
            </tr>
          </thead>
          <tbody>
          {registeredCourses.map((course) => (
              <tr key={course._id}>
                <td>{course.Course_ID}</td>
                <td>{course.Course_Name}</td>
                <td>{course.Credit_Hours}</td>
                <td>{course.Instructor}</td>
                <td>{course.Classroom}</td>
                <td>{course.Credit_Hours *  0.9}00.000</td>
                <td>{new Date().toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleCancelRegistration(course._id)}>
                    Hủy Đăng Ký
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StudentDashboard;
