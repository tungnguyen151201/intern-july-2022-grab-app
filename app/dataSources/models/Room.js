const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema({
  trip: { type: mongoose.ObjectId, required: true, uniqe: true },
  users: [{ type: mongoose.ObjectId, required: true }],
  messages: [
    {
      user: mongoose.ObjectId,
      message: String,
      createAt: Date,
    },
  ],
});

const room = mongoose.model('room', roomSchema);

module.exports = room;
