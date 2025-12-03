// Inside MatchSchema's pre('save') function:
const updatedPredictions = await Prediction.updateMany(
  { match: this._id },
  {
    $set: {
      predictionResult: matchOutcome
    }
  }
);

for (let prediction of updatedPredictions) {
  if (prediction.prediction === declaredWinner) {
    // Correctly predicted the winner, add 2 points
    user.score += 2;
  } else {
    // Incorrect prediction, deduct 1 point
    user.score -= 1;
  }
  
  await user.save();
}