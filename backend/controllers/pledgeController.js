import Pledge from "../models/Pledge.js";
import Class from "../models/Class.js";

// Create a new pledge
const createPledge = async (req, res) => {
  const { firstName, lastName, goal, currentAmount, completedDate, classId } = req.body;

  try {
    // Check if class exists
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const newPledge = new Pledge({
      firstName,        // First name
      lastName,         // Last name
      goal,             // Goal amount for the pledge
      currentAmount,    // Current amount pledged
      completedDate,    // Date when the pledge is completed
      classId,          // Reference to the Class model
    });

    await newPledge.save();
    // Add pledge reference to the class
    classDoc.pledges.push(newPledge._id);
    await classDoc.save();

    res.status(201).json(newPledge);
  } catch (err) {
    res.status(500).json({ message: 'Error creating pledge', error: err.message });
  }
};

// Get all pledges
const getPledges = async (req, res) => {
  try {
    const pledges = await Pledge.find().populate('classId');
    res.status(200).json(pledges);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pledges', error: err.message });
  }
};

// Get a pledge by ID
const getPledgeById = async (req, res) => {
  try {
    const pledge = await Pledge.findById(req.params.id).populate('classId');
    if (!pledge) {
      return res.status(404).json({ message: 'Pledge not found' });
    }
    res.status(200).json(pledge);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pledge', error: err.message });
  }
};

// Get pledges for a specific class
const getPledgesForClass = async (req, res) => {
  try {
    // Fetch pledges associated with the class using classId
    const pledges = await Pledge.find({ classId: req.params.id });
    if (!pledges.length) {
      return res.status(404).json({ message: 'No pledges found for this class' });
    }
    res.status(200).json(pledges);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pledges for class', error: err.message });
  }
};

// Update a pledge by ID
const updatePledge = async (req, res) => {
  const { firstName, lastName, goal, currentAmount, completedDate } = req.body;

  try {
    const updatedPledge = await Pledge.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, goal, currentAmount, completedDate },
      { new: true }
    );
    if (!updatedPledge) {
      return res.status(404).json({ message: 'Pledge not found' });
    }
    res.status(200).json(updatedPledge);
  } catch (err) {
    res.status(500).json({ message: 'Error updating pledge', error: err.message });
  }
};

// Delete a pledge by ID
const deletePledge = async (req, res) => {
  try {
    const deletedPledge = await Pledge.findByIdAndDelete(req.params.id);
    if (!deletedPledge) {
      return res.status(404).json({ message: 'Pledge not found' });
    }

    // Remove pledge reference from the class
    const classDoc = await Class.findById(deletedPledge.classId);
    classDoc.pledges = classDoc.pledges.filter(
      pledgeId => pledgeId.toString() !== req.params.id
    );
    await classDoc.save();

    res.status(200).json({ message: 'Pledge deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting pledge', error: err.message });
  }
};

export default {
  createPledge,
  getPledges,
  getPledgeById,
  getPledgesForClass,
  updatePledge,
  deletePledge
};
