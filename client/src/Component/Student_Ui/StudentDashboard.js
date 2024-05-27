import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./style_student/Studentboard.css";

import iuh1 from "../Student_Ui/style_student/iu1.png";
import toan from "../Student_Ui/style_student/h2.jpg";
import { useNavigate } from "react-router";

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
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCourseClasses, setSelectedCourseClasses] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const navigate = useNavigate();

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
      setTimeout(() => {
        setRegisteredCourses(response.data);
      }, 1000);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchRegisteredClassesBySemester = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/class/registered-classes/${studentId}/${semesterId}`
      );
      setRegisteredClasses(response.data.registeredClasses);
      console.log(response.data.registeredClasses);
    } catch (error) {
      console.error(error);
    }
  };
  const handleRegisterClass = async (classId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/class/register",
        {
          studentId: studentId,
          classId: classId,
          courseId: selectedCourses.length > 0 ? selectedCourses[0] : null,
          semesterId: semesterId,
        }
      );
      console.log(response.data);
      setTimeout(() => {
        enqueueSnackbar(response.data.message, { variant: "success" });
      }, 1000);
      await fetchRegisteredCourses(); 
      await fetchRegisteredClassesBySemester(); 
      fetchCoursesBySemester(semesterId);
      await fetchCourseClasses(selectedCourses[0]);
      setSelectedCourses([]);
      setSelectedClasses([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký lớp học thất bại.';
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };
  const handleCancelRegistration = async (registrationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/class/cancel/${registrationId}`
      );
      console.log(response.data);
      enqueueSnackbar(response.data.message, { variant: "success" });
      fetchRegisteredCourses();
      fetchRegisteredClassesBySemester(); // Reload the list of registered classes
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Xóa đăng ký thất bại.", { variant: "error" });
    }
  };
  const handleCheckboxChange = async (courseId) => {
    // Kiểm tra nếu môn học đã được chọn
    if (selectedCourses.includes(courseId)) {
      // Nếu đã được chọn, hủy bỏ chọn môn học
      setSelectedCourses([]);
      // Đồng thời cũng làm sạch danh sách các lớp học tương ứng
      setSelectedCourseClasses([]);
    } else {
      // Nếu chưa được chọn, thực hiện chọn môn học
      setSelectedCourses([courseId]);
      await fetchCourseClasses(courseId);
    }
  };

  const fetchCourseName = async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${courseId}`
      );
      return response.data.Course_Name;
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const fetchCourseClasses = async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/getClassesByCourse/${courseId}`
      );
      const classes = response.data.classes;
      const classesWithCourseName = await Promise.all(
        classes.map(async (classItem) => {
          const courseName = await fetchCourseName(classItem.courseId);
          return { ...classItem, courseName };
        })
      );
      setSelectedCourseClasses(classesWithCourseName);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    registeredClasses.forEach((classItem) => {});
  }, [registeredClasses]);
  useEffect(() => {
    if (studentId && semesterId) {
      fetchRegisteredClassesBySemester();
    }
  }, [studentId, semesterId]);
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
          <p
            onClick={() => navigate("/schedule")}
            style={{ cursor: "pointer",fontSize:30 }}
          >
            Xem Lịch Học
          </p>
          <p
            onClick={() => navigate("/info-student")}
            style={{ cursor: "pointer",fontSize:30 }}
          >
            Thông Tin Sinh Viên
          </p>
          <p>CHƯƠNG TRÌNH KHUNG</p>
        </div>
      </div>
      <div className="sv4">
        <h2>ĐĂNG KÝ HỌC PHẦN</h2>
      </div>
      <div className="sv5">
        <label style={{ fontSize: 30,color:'violet', fontWeight: "bold" }}>
          <h2>Đợt Đăng Kí</h2>
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

      {selectedCourseClasses.length > 0 && (
        <div className="tableListCoures-2">
          <h3 className="sv6">Danh sách các lớp học tương ứng:</h3>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Môn Học</th>
                <th>Mã Lớp HP</th>
                <th>Tên Lớp HP</th>
                <th>Giảng Viên</th>
                <th>Phòng Học</th>
                <th>Sỉ Số</th>
                <th>Trang Thái</th>
                <th>Đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourseClasses.map((classItem, index) => (
                <tr key={classItem._id}>
                  <td>{index + 1}</td>
                  <td>{classItem.courseName}</td>
                  <td>{classItem.Class_ID}</td>
                  <td>{classItem.Class_Name}</td>
                  <td>{classItem.Instructor}</td>
                  <td>{classItem.Classroom}</td>
                  <td>{classItem.Max_Students}</td>
                  <td>{classItem.status}</td>
                  <td>
                    <button onClick={() => handleRegisterClass(classItem._id)}>
                      Đăng ký
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="tableListCoures-1">
        <h2 className="sv6">Danh sách lớp học đã đăng ký</h2>
        <table>
          <thead>
            <tr>
              <th>Mã LHP</th>
              <th>Tên lớp học </th>
              <th>Giảng viên</th>
              <th>Phòng Học</th>  
              <th>Hủy Đăng Ký</th>
              {/* Thêm các cột khác nếu cần */}
            </tr>
          </thead>
          <tbody>
            {registeredClasses.map((registration, index) => (
              <tr key={index}>
                <td>{registration.classId.Class_ID}</td>
                <td>{registration.classId.Class_Name}</td>
                <td>{registration.classId.Instructor}</td>
                <td>{registration.classId.Classroom}</td>
                <td>
                  <button onClick={() => handleCancelRegistration(registration._id)}>
                    Xóa
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
