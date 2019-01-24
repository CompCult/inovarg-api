const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  book: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  url: {
    type: String
  }
}, { _id : false });

bookmarkSchema.pre('save', function(next) {
  const baseURL = 'https://storage.googleapis.com';
  this.url = `${baseURL}/compcult-almanaque/livro-${this.book}/page-${this.page}.pdf`;
  next();
});

module.exports = bookmarkSchema;