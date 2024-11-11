const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PledgeSchema = new Schema({
  firstName: { type: String, required: true },  // First name of the person associated with the pledge
  lastName: { type: String, required: true },   // Last name of the person associated with the pledge
  goal: { type: Number, required: true },       // Goal amount for the pledge
  currentAmount: { type: Number, default: 0 },  // Current amount pledged
  completedDate: { type: Date, required: true }, // Date when the pledge is completed
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },  // Reference to Class model
});

module.exports = mongoose.model('Pledge', PledgeSchema);
