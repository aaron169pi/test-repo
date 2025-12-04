const handleSubmit = async () => {
   if (!selectedMatch || !prediction) return;

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
      setSelectedMatch({
         ...selectedMatch,
         userPrediction: response.data.prediction || ""
      });
      fetchPredictions(selectedMatch._id);
   } catch (error) {
      alert(error.response?.data?.msg || "Error submitting prediction");
   } finally {
      setLoading(false);
   }
};