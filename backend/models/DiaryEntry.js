const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image'],
    required: true,
  },
  content: {
    type: String, // Can be the raw text or the Base64 image string
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Text-specific fields (Groq)
  emotion_tag: {
    type: String,
  },
  summary: {
    type: String,
  },
  // Image-specific fields (Gemini)
  color_palette: {
    type: [String], // Array of hex codes
  },
  aesthetic_tag: {
    type: String,
  },
  caption: {
    type: String,
  }
});

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);
