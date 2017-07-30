const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

module.exports = mongoose.model('Comment', {
  content: String,
  postId: Schema.Types.ObjectId,
  parentId: Schema.Types.ObjectId,
  timestamp: Date,
  author: {
    name: String,
    imageUrl: String,
    id: Schema.Types.ObjectId,
  },
});