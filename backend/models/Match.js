const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MatchSchema definition remains unchanged...

const MatchSchema = new Schema({
  teamOne: { type: Schema.Types.ObjectId, ref: 'Team' },
  teamTwo: { type: Schema.Types.ObjectId, ref: 'Team' },
  date: Date,
  time: String,
  location: String,
  predictedWinner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  declaredWinner: { type: Schema.Types.ObjectId, ref: 'Team', default: null }
});

MatchSchema.pre('save', function(next) {
  if (this.isModified('declaredWinner') && this.declaredWinner !== null) {
    const match = this;
    
    // Find all predictions for this match
    Prediction.find({ matchId: match._id })
      .exec((err, predictions) => {
        if (err) return next(err);

        // Update each prediction's score based on the declared winner
        predictions.forEach(prediction => {
          const predictionWinner = prediction.team; // Assuming 'team' is the field storing the predicted team

          // Compare as strings to ensure correct equality check
          if (predictionWinner.toString() === match.declaredWinner.toString()) {
            prediction.score = 2;
          } else {
            prediction.score = -1;
          }
        });

        // Save all updated predictions
        Prediction.bulkWrite(predictions.map(prediction => ({
          updateOne: {
            filter: { _id: prediction._id },
            update: { $set: { score: prediction.score } }
          }
        })), (err) => {
          if (err) return next(err);
          next();
        });
      });
  } else {
    next();
  }
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;