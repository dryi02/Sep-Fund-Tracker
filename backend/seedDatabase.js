const mongoose = require('mongoose');
const Class = require('./models/Class');
const Pledge = require('./models/Pledge'); // Pledge model
const connectDB = require('./config/db'); // Ensure you have DB connection logic

connectDB();  // Connect to the database

const seedDatabase = async () => {
  try {
    // Clear any existing data
    await Class.deleteMany();  // Clear existing classes
    await Pledge.deleteMany();  // Clear existing pledges

    // Create a sample class
    const newClass = new Class({
      name: 'Math 101',  // Name of the class
    });
    await newClass.save();  // Save the class

    // Create a couple of sample pledges associated with the new class
    const pledge1 = new Pledge({
      firstName: 'John',       // First name of the pledge
      lastName: 'Doe',         // Last name of the pledge
      goal: 1000,              // Goal amount for the pledge
      currentAmount: 100,      // Current amount pledged
      completedDate: new Date('2024-12-31'),  // Date of completion
      classId: newClass._id,   // Reference to the newly created class
    });

    const pledge2 = new Pledge({
      firstName: 'Jane',       // First name of the pledge
      lastName: 'Smith',       // Last name of the pledge
      goal: 500,               // Goal amount for the pledge
      currentAmount: 50,       // Current amount pledged
      completedDate: new Date('2024-12-31'),  // Date of completion
      classId: newClass._id,   // Reference to the newly created class
    });

    // Save the pledges
    await pledge1.save();
    await pledge2.save();

    // Add the pledges to the class's pledges array
    newClass.pledges.push(pledge1._id, pledge2._id);
    await newClass.save();  // Save the updated class with the pledges

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();  // Close the DB connection after seeding
  }
};

seedDatabase();
