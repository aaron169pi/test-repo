const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  prediction: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }, // user’s predicted winning team
  score: { type: Number, default: 0 }, // +2, -1 or 0 based on outcome
}, { timestamps: true });

/**
 * Static helper to calculate the score for a prediction.
 * @param {mongoose.Types.ObjectId} predictionId - The ID of the predicted team.
 * @param {mongoose.Types.ObjectId} declaredWinnerId - The ID of the actual winning team.
 * @returns {number} +2 if prediction matches declared winner, otherwise -1.
 */
ScoreSchema.statics.calculateScore = function (predictionId, declaredWinnerId) {
  if (!predictionId || !declaredWinnerId) {
    return 0; // No prediction or no declared winner yet
  }
  // Use .equals to compare ObjectId values correctly
  return predictionId.equals(declaredWinnerId) ? 2 : -1;
};

module.exports = mongoose.model('Score', ScoreSchema);