const mongoose = require('mongoose'); 

const postsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required : [true, 'Please enter the title']
    },
    image:{
      type: String,
    },
    content:{
      type: String,
      required: [true,"Please enter the content"]
    },
    tags: {
      type: String,
      required: [true,"Please enter the tags"]
    },
    user: { // this very very imp when 1 user post then if other user is logged in then he can see his post without any problem
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }, 

    likes: [{
      type: mongoose.Schema.Types.ObjectId, // we are going to store user id on that basis we find the total likes
      ref: 'User'
    }]
  },
  {
    timestamps: true
  }

);

module.exports = mongoose.model('Posts',postsSchema);