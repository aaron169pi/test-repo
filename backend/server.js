const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const matchRoutes = require('./routes/matches');
const scoreboardRoutes = require('./routes/scoreboard');
const predictionRoutes = require('./routes/matchPredictions');

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/scoreboard', scoreboardRoutes);
app.use('/api/predictions', predictionRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});