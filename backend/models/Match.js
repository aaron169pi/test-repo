const { User } = require("../models/user");
const { Prediction } = require("../models/prediction");

module.exports = (mongoose) => {
    const Match = mongoose.model(
        "match",
        new mongoose.Schema(
            {
                sport: {
                    type: String,
                    required: true
                },
                homeTeam: {
                    type: String,
                    required: true
                },
                awayTeam: {
                    type: String,
                    required: true
                },
                matchDate: {
                    type: Date,
                    default: Date.now()
                },
                status: {
                    type: String,
                    enum: ["scheduled", "in-progress", "completed"],
                    default: "scheduled"
                },
                declaredWinner: {
                    type: String,
                    default: null
                }
            },
            { timestamps: true }
        )
    );

    Match.pre("save", async function (next) {
        // Only update scores when match status changes to completed or winner is set
        if (!this.isModified("status") && !this.isModified("declaredWinner")) {
            return next();
        }

        try {
            const predictions = await Prediction.find({ matchId: this._id })
                .populate("userId")
                .exec();

            for (const prediction of predictions) {
                const user = prediction.user;
                
                // Calculate new score based on prediction accuracy
                if (prediction.team === this.declaredWinner) {
                    user.totalScore += 2;
                } else {
                    user.totalScore -= 1;
                }

                // Update the user's total score in database
                await User.findByIdAndUpdate(user._id, { 
                    $set: { totalScore: user.totalScore }
                });
            }

            next();
        } catch (error) {
            console.error("Error updating scores:", error);
            return next(error);
        }
    });

    return Match;
};