const handleSubmit = async () => {
   if (!selectedMatch || !prediction) return;

   // Check if match is past (already has a declared winner)
   if (selectedMatch.declaredWinner) {
      alert("Predictions are closed for this match");
      return;
   }

   setLoading(true);
   try {
      const response = await axios.post("/api/predictions",
         { matchId: selectedMatch._id, prediction },
         {
            headers: getAuthHeaders(),
            withCredentials: true,
         }
      );
      alert(response.data.msg); // Show success message
      setSelectedMatch(null);
      
      // Fetch fresh data after submission to update predictions list
      fetchMatches();
   } catch (error) {
      alert(error.response?.data?.msg || "Error submitting prediction");
   } finally {
      setLoading(false);
   }
};