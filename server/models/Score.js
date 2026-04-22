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
  },
  // ✅ FIX: Add game field so dino and flappy scores are separated
  game: {
    type: String,
    required: true,
    enum: ['dino', 'flappy'], // only these two values allowed
    default: 'dino'
  }
}, {
  timestamps: true
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;