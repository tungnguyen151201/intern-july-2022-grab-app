const mongoose = require('mongoose');

const { Schema } = mongoose;

const tripSchema = new Schema({
  customerId: { type: mongoose.ObjectId, required: true, ref: 'user' },
  driverId: { type: mongoose.ObjectId, required: true, ref: 'user' },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  totalPaid: Number,
  status: { type: String, enum: ['Pending', 'Driving', 'Finished'], required: true },
});

const Trip = mongoose.model('trip', tripSchema);

module.exports = Trip;
