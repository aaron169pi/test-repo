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
  if (this.isModified("declaredWinner")) {
    try {
      const matchId = this._id;
      const declaredWinner = this.declaredWinner;

      // Fetch all predictions for this match
      const predictions = await Score.find({ match: matchId })
        .populate('predictedBy', 'username');

      for (let prediction of predictions) {
        if (!prediction.createdAt) continue; // Skip invalid predictions

        // Only score predictions made before the match started
        if (prediction.createdAt < this.matchDate) {
          prediction.score = prediction.prediction === declaredWinner ? 2 : -1;
          await prediction.save();
        } else {
          // Partial points for in-game and post-game predictions
          prediction.score = prediction.prediction === declaredWinner ? 1 : 0;
          await prediction.save();
        }
      }
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  }
  next();
});

module.exports = mongoose.model("Match", MatchSchema);