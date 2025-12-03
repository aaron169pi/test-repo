const userPredictions = [
  { matchId: 1, predictedWinner: 'Team A' },
  // ... other predictions
];

const matchResults = [
  { matchId: 1, winner: 'Team B' },
  // ... other results
];

function calculateScore(userPreds, results) {
  let score = 0;
  
  userPreds.forEach(pred => {
    const result = results.find(r => r.matchId === pred.matchId);
    
    if (result && pred.predictedWinner === result.winner) {
      score += 2; // Award 2 points for a correct prediction
    } else {
      score -= 1; // Deduct 1 point for an incorrect prediction
    }
  });
  
  return score;
}

// Calculate the user's final score
const finalScore = calculateScore(userPredictions, matchResults);