import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./style_student/Studentboard.css";
import iuh1 from "../Student_Ui/style_student/iu1.png";
import toan from "../Student_Ui/style_student/h2.jpg";

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [hiddenStudentId, setHiddenStudentId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
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
      enqueueSnackbar(response.data.message, { variant: "success" });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Đăng ký thất bại.", { variant: "error" });
    }
  };

  const handleCheckboxChange = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
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
          <button type="submit" style={{ marginLeft: 20, fontSize: 20 }}>
            Đăng Kí
          </button>
        </form>
      </div>
      <div className="sv6">
        <h2>Môn Học Phần Đang Chờ Đăng Ký</h2>
      </div>

      <table>
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
    </div>
  );
};

export default StudentDashboard;
