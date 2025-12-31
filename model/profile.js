const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  image:{
    type: String
  },
  bio:{
    type: String
  },
  user: { // for fetching with each other
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Profile', profileSchema);