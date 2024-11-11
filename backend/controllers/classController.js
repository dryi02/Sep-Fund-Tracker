const Class = require('../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
  const { name } = req.body;

  try {
    const newClass = new Class({ name });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: 'Error creating class', error: err.message });
  }
};

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching classes', error: err.message });
  }
};

// Get a class by ID
exports.getClassById = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id).populate('pledges');
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(classDoc);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching class', error: err.message });
  }
};

// Update a class by ID
exports.updateClass = async (req, res) => {
  const { name } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: 'Error updating class', error: err.message });
  }
};

// Delete a class by ID
exports.deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting class', error: err.message });
  }
};
