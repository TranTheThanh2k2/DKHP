const express = require('express');
const router = express.Router();
const semestersController = require('../controllers/semestersController');

router.get('/', semestersController.getAllSemesters);
router.post('/', semestersController.createSemester);
router.put('/:id', semestersController.updateSemester);
router.delete('/:id', semestersController.deleteSemester);

module.exports = router;
