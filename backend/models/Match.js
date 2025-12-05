import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Medal, Star, Loader2 } from "lucide-react";

export default function Scoreboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get player's personal best (highest score)
  const fetchPersonalBest = async (userId) => {
    try {
      const { data } = await axios.get(`/api/scoreboard/personal-best/${userId}`);
      return data;
    } catch (error) {
      console.error("Error fetching personal best:", error);
      return null;
    }
  };

  // Get player's current score
  const fetchCurrentScore = async (userId) => {
    try {
      const { data } = await axios.get(`/api/scoreboard/current-score/${userId}`);
      return data;
    } catch (error) {
      console.error("Error fetching current score:", error);
      return null;
    }
  };

  // Calculate percentage of personal best
  const calculatePercentage = (current, pb) => {
    if (!pb || pb === 0) return "N/A";
    return ((current / pb) * 100).toFixed(2);
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const [scoreData] = await Promise.all([
          axios.get("/api/scoreboard"),
        ]);
        
        // Format data with personal best and percentages
        const formattedScores = await Promise.all(
          scoreData.data.map(async (player) => {
            const pb = await fetchPersonalBest(player.userId);
            const current = await fetchCurrentScore(player.userId);
            
            return {
              ...player,
              personalBest: pb || 0,
              currentScore: current || 0,
              percentage: calculatePercentage(current, pb)
            };
          })
        );

        setScores(formattedScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 mb-2">
            Leaderboard
          </h2>
          <p className="text-gray-400">Top players and their achievements</p>
        </div>

        {/* Scoreboard Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-gray-400">Loading scores...</span>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl">
              <div className="overflow-x-auto" style={{ maxHeight: "70vh" }}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700/50 text-gray-300">
                      <th className="sticky top-0 bg-gray-700/50 backdrop-blur-sm px-3 py-2 text-left font-bold text-sm md:text-base">Rank</th>
                      <th className="sticky top-0 bg-gray-700/50 backdrop-blur-sm px-3 py-2 text-left font-bold text-sm md:text-base">Player</th>
                      <th className="sticky top-0 bg-gray-700/50 backdrop-blur-sm px-3 py-2 text-right font-bold text-sm md:text-base">Current</th>
                      <th className="sticky top-0 bg-gray-700/50 backdrop-blur-sm px-3 py-2 text-right font-bold text-sm md:text-base">Personal Best</th>
                      <th className="sticky top-0 bg-gray-700/50 backdrop-blur-sm px-3 py-2 text-right font-bold text-sm md:text-base">% of PB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {scores.length > 0 ? (
                      scores.map((player, index) => (
                        <tr
                          key={player.userId}
                          className={`group transition-all duration-200 ${
                            player.currentScore === player.personalBest
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-2">{index + 1}</td>
                          <td className="px-3 py-2 flex items-center gap-2">
                            {getRankIcon(index + 1)}
                            {player.username}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {player.currentScore.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {player.personalBest.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {player.percentage}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-400 py-12">
                          No scores available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}