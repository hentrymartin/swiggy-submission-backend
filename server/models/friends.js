const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

module.exports = mongoose.model('Friends', {
  name: String,
  email: String,
  userId: Schema.Types.ObjectId,
  timestamp: Date,
  imageUrl: String,
});