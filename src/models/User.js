const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Driver', 'Customer', 'Admin'], required: true },
  isActive: Boolean,
});

const User = mongoose.model('user', userSchema);

module.exports = User;
