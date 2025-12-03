const mongoose = require("mongoose");
const Score = require("./Score");

const MatchSchema = new mongoose.Schema(
  {
    teamOne: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    teamTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    matchDate: { type: Date, required: true },
    additionalDetails: { type: String },
    declaredWinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // Admin sets the winning team
  },
  { timestamps: true }
);

// Hook to recalculate user scores when declaredWinner changes
MatchSchema.pre("save", async function (next) {
  if (this.isModified("declaredWinner") && this.declaredWinner) {
    try {
      const matchId = this._id;
      const declaredWinner = this.declaredWinner;

      // Fetch all predictions for this match
      const predictions = await Score.find({ match: matchId })
        .select('prediction score user');

      for (let prediction of predictions) {
        if (!prediction.prediction || !prediction._id) continue; // Skip invalid predictions
        
        try {
          // Calculate new score
          const newScore = prediction.prediction.toString() === declaredWinner.toString() 
            ? 2 // Correct prediction - award 2 points
            : -1; // Incorrect prediction - deduct 1 point

          if (prediction.score !== newScore) {
            prediction.score = newScore;
            await prediction.save();
          }
        } catch (error) {
          console.error(`Error updating score for prediction ${prediction._id}:`, error);
        }
      }

    } catch (error) {
      console.error("Error updating scores:", error);
    }
  }
  next();
});

module.exports = mongoose.model("Match", MatchSchema);