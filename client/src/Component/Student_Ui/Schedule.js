import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Schedule = () => {
  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [hiddenStudentId, setHiddenStudentId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classSchedule, setClassSchedule] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
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
      const response = await axios.get(`http://localhost:3000/semesters`);
      setSemesters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClassDetails = async (classId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/${classId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchRegisteredClassesBySemester = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/class/registered-classes/${studentId}/${semesterId}`
      );
      const registeredClassesWithDetails = await Promise.all(
        response.data.registeredClasses.map(async (classItem) => {
          const classDetails = await fetchClassDetails(classItem.classId);
          return { ...classItem, ...classDetails };
        })
      );
      setRegisteredClasses(registeredClassesWithDetails);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (semesterId && studentId) {
      fetchRegisteredClassesBySemester();
    }
  }, [semesterId, studentId]);

  const handleClassSelection = async (classId) => {
    setSelectedClass(classId);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/schedule/${classId}`
      );
      setClassSchedule(response.data.schedule);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = async (date) => {
    setSelectedClass(null); // Reset selectedClass when changing date
    try {
      const response = await axios.get(`http://localhost:3000/api/schedule`, {
        params: { date },
      });
      setClassSchedule(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <h3>Xin Chào !</h3>
        <p>{fullName}</p>
        <p>Giới Tính : {gender}</p>
        <p>Khoa : {departmentCode} </p>
      </div>
      <div>
        <h2>Lịch Học</h2>
      </div>
      <div>
        <label style={{ fontSize: 20, fontWeight: "bold" }}>
          Chọn Học Kỳ:
          <select
            style={{ marginLeft: 20, fontSize: 20 }}
            value={semesterId}
            onChange={(e) => {
              setSemesterId(e.target.value);
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
      {semesterId ? (
        <div className="tableListCourses">
          <h2 className="heading">Danh sách lớp học đã đăng ký</h2>
          <table>
            <thead>
              <tr>
                <th>Mã LHP</th>
                <th>Tên lớp học</th>
                <th>Giảng viên</th>
                <th>Phòng Học</th>
              </tr>
            </thead>
            <tbody>
              {registeredClasses.map((classItem) => (
                <tr
                  key={classItem._id}
                  onClick={() => handleClassSelection(classItem.classId)}
                >
                  <td>{classItem.Class_ID}</td>
                  <td>{classItem.Class_Name}</td>
                  <td>{classItem.Instructor}</td>
                  <td>{classItem.Classroom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Vui lòng chọn học kỳ</p>
      )}
      <div className="schedule-view">
        <div className="schedule-details">
          <h2>Lịch học</h2>
          <Calendar onChange={handleDateChange} value={new Date()} />
          <table>
            <thead>
              <tr>
                <th>Ca học</th>
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
              {/* Render the schedule here */}
              {classSchedule && (
                <tr>
                  <td>{classSchedule.timeSlot}</td>
                  <td>
                    {classSchedule.dayOfWeek === "Monday"
                      ? classSchedule.timeSlot
                      : ""}
                  </td>
                  <td>
                    {classSchedule.dayOfWeek === "Tuesday"
                      ? classSchedule.timeSlot
                      : ""}
                  </td>
                  <td>
                    {classSchedule.dayOfWeek === "Wednesday"
                      ? classSchedule.timeSlot
                      : ""}
                  </td>
                  <td>
                    {classSchedule.dayOfWeek === "Thursday"
                      ? classSchedule.timeSlot
                      : ""}
                  </td>
                  <td>
                    {classSchedule.dayOfWeek === "Friday"
                      ? classSchedule.timeSlot
                      : ""}
                  </td>
                  <td>
                    {classSchedule.dayOfWeek === "Saturday"
                      ? classSchedule.timeSlot
                      : ""}
                  </td>
                  <td>
                    {classSchedule.dayOfWeek === "Sunday"
                      ? classSchedule.timeSlot
                      : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
