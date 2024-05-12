import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [message, setMessage] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const studentIdFromStorage = localStorage.getItem('studentID');
    if (studentIdFromStorage) {
      setStudentId(studentIdFromStorage);
      fetchStudentDetails(studentIdFromStorage);
    }
  }, []);

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/students/${studentId}`);
      console.log(response.data.data.Full_Name)
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegisterCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/courses/register', {
        studentId: studentId,
        courseId: courseId,
        semesterId: semesterId
      });
      setMessage(response.data.message); // Assuming the server returns a message
    } catch (error) {
      console.error(error);
      setMessage('Failed to register course.'); // Display error message if registration fails
    }
  };

  return (
    <div>
      <h2>Xin Chào {fullName}</h2>
      <form onSubmit={handleRegisterCourse}>
        <label>
          Student ID:
          <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} disabled />
        </label>
        <label>
          Course ID:
          <input type="text" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
        </label>
        <label>
          Semester ID:
          <input type="text" value={semesterId} onChange={(e) => setSemesterId(e.target.value)} />
        </label>
        <button type="submit">Register Course</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default StudentDashboard;
