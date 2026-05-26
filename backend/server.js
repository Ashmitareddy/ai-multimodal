const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const diaryRoutes = require('./routes/diaryRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not provided. Skipping MongoDB connection for now.');
}

app.use('/api/diary', diaryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Digital Vibe Diary API is running' });
});

// Do not start the server if we are running in a serverless environment like Vercel
// Vercel sets an environment variable, typically we check if we are required as a module
if (require.main === module) {
  const PORT = process.env.PORT || 3001; // Not 5000 as per constraints
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
