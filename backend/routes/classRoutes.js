const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// Route to create a new class
router.post('/', classController.createClass);

// Route to get all classes
router.get('/', classController.getClasses);

// Route to get a class by ID
router.get('/:id', classController.getClassById);

// Route to update a class by ID
router.put('/:id', classController.updateClass);

// Route to delete a class by ID
router.delete('/:id', classController.deleteClass);

module.exports = router;
