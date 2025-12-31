const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName:{
    type: String,
    required: [true, 'First Name is Required']
  },
  lastName:{
    type: String,
    required: [true, 'Last Name is Required']
  },
  email:{ 
    type: String,
    required: [true, 'Email is Required'],
    unique: true
  },
  password:{
    type: String,
    required: [true, 'Password is Required']
  },
  userType:{
    type: String,
    enum: ['guest','host'],
    default: 'guest'
  },
  saved:[{ // saved posts array
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts'
  }]
});

module.exports = mongoose.model('User',userSchema);