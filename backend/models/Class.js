import mongoose from 'mongoose';

const { Schema } = mongoose;

const ClassSchema = new Schema({
  name: { type: String, required: true },
  pledges: [{ type: Schema.Types.ObjectId, ref: 'Pledge' }]  // Reference to Pledge model
});

const Class = mongoose.model('Class', ClassSchema);
export default Class;
