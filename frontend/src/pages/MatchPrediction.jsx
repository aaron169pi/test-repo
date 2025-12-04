import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MatchList = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handlePredictionSubmit = async (matchId, prediction) => {
    try {
      const response = await axios.post('http://localhost:5000/predictions', {
        matchId,
        prediction
      });
      console.log('Prediction submitted:', response.data);
      getMatches(); // Refresh the matches list to update predictions
    } catch (error) {
      console.error('Error submitting prediction:', error.response?.data?.msg || error);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      await axios.delete(`http://localhost:5000/matches/${matchId}`);
      getMatches(); // Refresh the matches list after deletion
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Match List</h2>
      <div className="row">
        {matches.map((match) => (
          <div key={match._id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Match ID: {match._id}</h5>
                <p className="card-text">
                  {match.teamOneName} vs {match.teamTwoName}
                </p>
                <p className="card-text">Date: {new Date(match.matchDate).toLocaleString()}</p>
                <div className="text-center mb-3">
                  <strong>Additional Details:</strong>
                  <p>{match.additionalDetails}</p>
                </div>

                {match.declaredWinner && (
                  <div className="alert alert-info" role="alert">
                    Winner declared: {match.declaredWinner}
                  </div>
                )}

                {!match.declaredWinner && !match.userPrediction && (
                  <div className="input-group mb-3">
                    <select 
                      className="form-select"
                      onChange={(e) => handlePredictionSubmit(match._id, e.target.value)}
                      disabled={new Date() > new Date(match.matchDate.getTime())}
                    >
                      <option value="">Predict a team</option>
                      <option value={match.teamOneName}>{match.teamOneName}</option>
                      <option value={match.teamTwoName}>{match.teamTwoName}</option>
                    </select>
                  </div>
                )}

                {match.userPrediction && (
                  <div className="text-center">
                    <p>Your prediction: {match.userPrediction}</p>
                    {match.declaredWinner === match.userPrediction ? (
                      <p className="text-success">Correct!</p>
                    ) : (
                      <p className="text-danger">Incorrect</p>
                    )}
                    <button 
                      onClick={() => handleDeleteMatch(match._id)}
                      className="btn btn-danger"
                      disabled={!!match.declaredWinner}
                    >
                      Delete Match
                    </button>
                    <p className="text-center">Score: {match.userScore}</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchList;