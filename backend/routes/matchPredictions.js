const express = require('express');
const Score = require('../models/Score');
const Match = require('../models/Match');
const Team = require('../models/Team');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all predictions
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find().populate('user').populate('match').exec();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Submit a prediction
router.post('/', [
  auth,
  body('matchId', 'Match ID is required').isMongoId(),
  body('teamName', 'Team name is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { matchId, teamName } = req.body;
    const userId = req.user.id;

    // Check if match exists
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ msg: 'Match not found' });
    }

    // Check if team exists and is part of the match
    const team = await Team.findOne({ name: teamName });
    if (!team || (!match.team1.equals(team._id) && !match.team2.equals(team._id))) {
      return res.status(404).json({ msg: 'Team not found or not part of this match' });
    }

    // Check if user has already made a prediction for this match
    const existingPrediction = await Score.findOne({ user: userId, match: matchId });
    if (existingPrediction) {
      return res.status(400).json({ msg: 'You have already made a prediction for this match' });
    }

    // Create new prediction
    const score = new Score({
      user: userId,
      match: matchId,
      predictedTeam: team._id
    });

    await score.save();
    res.status(201).json(score);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;