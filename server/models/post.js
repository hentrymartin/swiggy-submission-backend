const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

module.exports = mongoose.model('Post', {
  content: String,
  timestamp: Date,
  author: {
    name: String,
    imageUrl: String,
    id: Schema.Types.ObjectId,
  },
});