const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  prediction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);