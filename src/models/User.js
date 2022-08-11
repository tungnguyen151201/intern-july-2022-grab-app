const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  firstName: String,
  lastName: String,

  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Driver', 'Customer', 'Admin'], required: true },

  status: {
    type: 'String',
    enum: ['Active', 'Pending', 'Deactivated'],
  },
  // isActive: Boolean,
});

const User = mongoose.model('user', userSchema);

module.exports = User;
