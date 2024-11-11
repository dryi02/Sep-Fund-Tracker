const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  name: { type: String, required: true },
  pledges: [{ type: Schema.Types.ObjectId, ref: 'Pledge' }]  // Reference to Pledge model
});

module.exports = mongoose.model('Class', ClassSchema);
