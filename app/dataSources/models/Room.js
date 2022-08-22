const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema({
  name: String,
  user1: { type: mongoose.ObjectId, required: true },
  user2: { type: mongoose.ObjectId, required: true },
  messages: [
    new Schema({
      user: { type: mongoose.ObjectId, required: true },
      message: String,
    }),
  ],
});

const room = mongoose.model('room', roomSchema);

module.exports = room;
