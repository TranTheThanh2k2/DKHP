import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [message, setMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [hiddenStudentId, setHiddenStudentId] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const studentIdFromStorage = localStorage.getItem('studentID');
    if (studentIdFromStorage) {
      setStudentId(studentIdFromStorage);
      setHiddenStudentId(studentIdFromStorage);
      fetchStudentDetails(studentIdFromStorage);
      fetchSemesters();
    }
  }, []);

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/students/${studentId}`);
      setFullName(response.data.data.student.Full_Name);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/semesters`);
      setSemesters(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchCoursesBySemester = async (semesterId) => {
    try {
      const response = await axios.get(`http://localhost:3000/courses/${semesterId}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleRegisterCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/course/register', {
        studentId: studentId,
        courseId: courseId,
        semesterId: semesterId
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Đăng kí thất bại.');
    }
  };

  return (
    <div>
      <h2>Sinh Viên:  {fullName}</h2>
      <form onSubmit={handleRegisterCourse}>
        <input type="hidden" value={hiddenStudentId} />
        <label>
          <input type="hidden" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
        </label>
        <label>
          Đợt Đăng Kí
          <select value={semesterId} onChange={(e) => {
            setSemesterId(e.target.value);
            fetchCoursesBySemester(e.target.value);
          }}>
            <option value="">-- Chọn học kỳ --</option>
            {semesters.map(semester => (
              <option key={semester._id} value={semester._id}>{semester.Semester_Name}</option>
            ))}
          </select>
        </label>
        <label>
          Môn Học:
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">-- Chọn môn học --</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.Course_Name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Đăng Kí</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default StudentDashboard;
