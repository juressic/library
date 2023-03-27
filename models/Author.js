const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    require: true,
  },
  name: {
    type: String,
    unique: true,
    require: true,
  },
});

module.exports = mongoose.model('author', AuthorSchema);
