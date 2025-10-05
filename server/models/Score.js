const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 15
  },
  score: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;

