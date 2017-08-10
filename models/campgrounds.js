const mongoose = require("mongoose");
const Comment = require("./comments");
// const Comment = require("./models/comments");

//Schema for my campsites
const campSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }]
});

campSchema.post('remove', (camp) => {
  Comment.remove({ _id: { $in: camp.comments }}).exec();
});

// Model 
module.exports = mongoose.model('camp', campSchema);
