// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.post('/addClass', classController.addClass);
router.get('/getAllClasses', classController.getAllClasses);
router.get('/:classId', classController.getClassDetails);

router.get('/getClassesByCourse/:courseId', classController.getClassesByCourse);
router.delete('/deleteClass/:id', classController.deleteClass);
router.put('/updateClass/:id', classController.updateClass);

module.exports = router;
