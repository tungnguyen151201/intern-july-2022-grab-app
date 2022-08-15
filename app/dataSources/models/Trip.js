const mongoose = require('mongoose');

const { Schema } = mongoose;

const tripSchema = new Schema({
  customer: { type: mongoose.ObjectId, required: true, ref: 'user' },
  driver: { type: mongoose.ObjectId, ref: 'user' },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  totalPaid: Number,
  status: { type: String, enum: ['Pending', 'Driving', 'Finished', 'Canceled'], required: true },
});

const Trip = mongoose.model('trip', tripSchema);

module.exports = Trip;
