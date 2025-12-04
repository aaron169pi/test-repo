import React from 'react';

const MatchPrediction = () => {
  // ... [previous state and functions remain unchanged] ...

  const handleMatchSelection = (match) => {
    setSelectedMatch(match);
    fetchPredictions(match._id);
  };

  // Calculate prediction scores object
  const getScores = (predictions) => {
    const scores = { 
      [selectedMatch.teamOneName]: 0,
      [selectedMatch.teamTwoName]: 0 
    };
    if (predictions[selectedMatch.teamOneName]) {
      scores[selectedMatch.teamOneName] = predictions[selectedMatch.teamOneName].length;
    }
    if (predictions[selectedMatch.teamTwoName]) {
      scores[selectedMatch.teamTwoName] = predictions[selectedMatch.teamTwoName].length;
    }
    return scores;
  };

  // ... [rest of the component remains unchanged until the JSX section] ...

  {selectedMatch === match && Object.keys(matchPredictions).length > 0 && (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mt-6 p-6">
      <h2 className="text-xl font-semibold mb-4">User Predictions</h2>
      <table className="w-full border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-700 text-yellow-400">
            <th className="border border-gray-600 px-4 py-2">Team</th>
            <th className="border border-gray-600 px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(getScores(matchPredictions)).map(([team, score]) => (
            <tr key={team} className="text-center bg-gray-700">
              <td className="border border-gray-600 px-4 py-2">{team}</td>
              <td className="border border-gray-600 px-4 py-2">
                {score || "0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  // ... [rest of the component remains unchanged] ...
};