const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  id: {
    type: Number,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
    unique: true,
  },
  authorId: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model('book', BookSchema);
