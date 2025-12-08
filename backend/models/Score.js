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
      const matchStartTime = this.matchDate;

      // Get current date/time
      const now = new Date();

      // Check if match has started
      if (now < matchStartTime) {
        console.log("Match has not started yet - skipping score updates");
        return next(); // Skip score updates if match hasn't started
      }

      // Fetch all predictions for this match created AFTER the match started
      const predictions = await Score.find({
        match: matchId,
        createdAt: { $gte: matchStartTime } // Only score predictions made after match start
      });

      for (let prediction of predictions) {
        if (prediction.prediction === declaredWinner) {
          prediction.score = 2;
        } else {
          prediction.score = -1;
        }
        await prediction.save();
      }
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  }
  next();
});

module.exports = mongoose.model("Match", MatchSchema);