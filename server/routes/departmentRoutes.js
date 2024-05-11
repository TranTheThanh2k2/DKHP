const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Route to create a new department
router.post('/departments', departmentController.createDepartment);

// Route to get all departments
router.get('/departments', departmentController.getAllDepartments);

// Route to get a single department by its ID
router.get('/departments/:id', departmentController.getDepartmentById);

// Route to update a department
router.put('/departments/:id', departmentController.updateDepartment);

// Route to delete a department
router.delete('/departments/:id', departmentController.deleteDepartment);

module.exports = router;
