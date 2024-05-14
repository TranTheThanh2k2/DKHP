import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import LoginForm from './Component/LoginForm';
import StudentDashboard from './Component/Student_Ui/StudentDashboard';
import CourseForm from './Component/Admin_Ui/Form_Admin/CourseForm';
import DepartmentForm from './Component/Admin_Ui/Form_Admin/DepartmentForm';
import SemesterForm from './Component/Admin_Ui/Form_Admin/SemesterForm';
import AdminDashboard from './Component/Admin_Ui/AdminDashboard';


const App = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/manage-courses" element={<CourseForm />} />
          <Route path="/manage-semesters" element={<SemesterForm />} />
          <Route path="/manage-departments" element={<DepartmentForm />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
