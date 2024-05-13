import React, { useState, useEffect } from "react";
import axios from "axios";

const DepartmentForm = () => {
  // State
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    Department_Code: "",
    Department_Name: "",
  });
  const [loading, setLoading] = useState(true);

  // Effect to fetch departments when component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Function to fetch departments from the server
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/departments");
      setDepartments(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle creation of a new department
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/departments", newDepartment);
      setNewDepartment({
        Department_Code: "",
        Department_Name: "",
      });
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="department-form-wrapper">
      <h3 className="department-form-title">Tạo mới phòng ban</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="create-department-form">
            <form onSubmit={handleCreateDepartment}>
              <div className="input-group">
                <input
                  type="text"
                  value={newDepartment.Department_Code}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      Department_Code: e.target.value,
                    })
                  }
                  placeholder="Mã phòng ban"
                  className="department-input"
                />
                <input
                  type="text"
                  value={newDepartment.Department_Name}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      Department_Name: e.target.value,
                    })
                  }
                  placeholder="Tên phòng ban"
                  className="department-input"
                />
              </div>
              <div className="button">
                <button type="submit" className="submit-button">
                  Tạo mới
                </button>
              </div>
            </form>
          </div>

          <div className="horizontal-line"></div>

          <div className="department-list">
            <h3 className="department-list-title">Danh sách phòng ban</h3>
            <ul className="department-items">
              {departments.map((department) => (
                <li
                  key={department.Department_Code}
                  className="department-item"
                >
                  {department.Department_Code} - {department.Department_Name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default DepartmentForm;
