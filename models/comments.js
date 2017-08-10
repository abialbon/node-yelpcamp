const mongoose = require("mongoose");

//Schema for my campsites
const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});
// Model 
module.exports = mongoose.model('comment', commentSchema);
