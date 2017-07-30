const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  name: String,
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  timestamp: Date,
  imageUrl: String,
});