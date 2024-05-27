import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style_student/ScheduleView.css";

const Schedule = () => {
  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [hiddenStudentId, setHiddenStudentId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [classSchedule, setClassSchedule] = useState(null);

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
      const student = response.data.data.student;
      setFullName(student.Full_Name);
      setDepartmentCode(student.Department_Code);
      setGender(student.Gender);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/semesters/`);
      setSemesters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSemesterChange = (e) => {
    const selectedSemesterId = e.target.value;
    console.log("Selected semesterId:", selectedSemesterId);
    setSemesterId(selectedSemesterId);
    fetchClassScheduleBySemester(selectedSemesterId);
  };
  const fetchClassScheduleBySemester = async (selectedSemesterId) => {
    try {
      console.log("Fetching class schedule for semesterId:", selectedSemesterId);
      
      // Gọi API để lấy danh sách các lớp học đã đăng ký trong học kỳ
      const response = await axios.get(
        `http://localhost:3000/api/class/registered-classes/${studentId}/${selectedSemesterId}`
      );
  
      // Lấy danh sách các lớp học đã đăng ký từ phản hồi
      const registeredClasses = response.data.registeredClasses;
  
      // Tạo đối tượng để lưu trữ lịch học theo ngày và khung giờ
      const updatedClassSchedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      };
  
      // Duyệt qua từng lớp học đã đăng ký để thêm thông tin vào lịch học
      registeredClasses.forEach((registration) => {
        if (registration.classId && registration.classId.schedule) {
          const { schedule } = registration.classId;
          updatedClassSchedule[schedule.dayOfWeek].push({
            timeSlot: schedule.timeSlot,
            className: registration.classId.Class_Name,
            instructor: registration.classId.Instructor,
            classroom: registration.classId.Classroom
          });
        }
      });
  
      // Cập nhật state với lịch học đã được xây dựng từ danh sách lớp học đã đăng ký
      setClassSchedule(updatedClassSchedule);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const renderSemesterDropdown = () => (
    <select value={semesterId} onChange={handleSemesterChange}>
      <option value="">-- Chọn học kỳ --</option>
      {semesters.map((semester) => (
        <option key={semester._id} value={semester._id}>
          {semester.Semester_Name}
        </option>
      ))}
    </select>
  );

  const getClassPeriod = (timeSlot) => {
    const startTime = parseInt(timeSlot.split("-")[0]);
    if (startTime >= 1 && startTime <= 3) {
      return "Sáng";
    } else if (startTime >= 4 && startTime <= 6) {
      return "Chiều";
    } else if (startTime >= 7 && startTime <= 9) {
      return "Chiều";
    } else {
      return "Tối";
    }
  };

  return (
    <div className="schedule-container">
      <h3 className="h3">Xin Chào ! {fullName}</h3>
      <p>Khoa : {departmentCode} </p>
      <div className="schedule-dropdown">
        <label>Chọn Học Kỳ:</label>
        {renderSemesterDropdown()}
      </div>
      {classSchedule && (
        <div>
          <h2 className="h2">Lịch Học</h2>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Ca Học</th>
                <th>Thứ 2</th>
                <th>Thứ 3</th>
                <th>Thứ 4</th>
                <th>Thứ 5</th>
                <th>Thứ 6</th>
                <th>Thứ 7</th>
                <th>Chủ nhật</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sáng</td>
                {Object.keys(classSchedule).map((day) => {
                  const timeSlot = classSchedule[day].find(
                    (item) => item.timeSlot === "1-3" || item.timeSlot === "4-6"
                  );
                  return (
                    <td key={`${day}-morning`}>
                      {timeSlot ? (
                        <div>
                          <p className="lecture">{timeSlot.className}</p>
                          <p>Giảng Viên: {timeSlot.instructor}</p>
                          <p>Phòng Học: {timeSlot.classroom}</p>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td>Chiều</td>
                {Object.keys(classSchedule).map((day) => {
                  const timeSlot = classSchedule[day].find(
                    (item) => item.timeSlot === "7-9" || item.timeSlot === "10-12"
                  );
                  return (
                    <td key={`${day}-afternoon`}>
                      {timeSlot ? (
                        <div>
                          <p className="lecture">{timeSlot.className}</p>
                          <p>Giảng Viên: {timeSlot.instructor}</p>
                          <p>Phòng Học: {timeSlot.classroom}</p>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td>Tối</td>
                {Object.keys(classSchedule).map((day) => {
                  const timeSlot = classSchedule[day].find(
                    (item) => item.timeSlot === "13-15"
                  );
                  return (
                    <td key={`${day}-evening`}>
                      {timeSlot ? (
                        <div>
                          <p className="lecture">{timeSlot.className}</p>
                          <p>Giảng Viên: {timeSlot.instructor}</p>
                          <p>Phòng Học: {timeSlot.classroom}</p>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Schedule;