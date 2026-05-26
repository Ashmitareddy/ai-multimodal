const DiaryEntry = require('../models/DiaryEntry');
const { runPipeline } = require('../utils/langsmithTracing');
const { getGroqChatCompletion } = require('../utils/groqClient');
const { getGeminiVisionCompletion } = require('../utils/geminiClient');

exports.logEntry = async (req, res) => {
  try {
    const { type, content } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: 'Type and content are required' });
    }

    let result = {};
    let newEntryData = { type, content };

    if (type === 'text') {
      result = await runPipeline(content, async (prompt) => {
        return await getGroqChatCompletion(prompt);
      });
      newEntryData.emotion_tag = result.emotion_tag;
      newEntryData.summary = result.summary;
    } else if (type === 'image') {
      result = await runPipeline(content, async (base64) => {
        return await getGeminiVisionCompletion(base64);
      });
      newEntryData.color_palette = result.color_palette;
      newEntryData.aesthetic_tag = result.aesthetic_tag;
      newEntryData.caption = result.caption;
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    // Try to save to DB, if connection fails, just return result (for local dev without DB)
    let savedEntry = newEntryData;
    try {
      const entry = new DiaryEntry(newEntryData);
      savedEntry = await entry.save();
    } catch (dbError) {
      console.warn("Database save failed (might not be connected):", dbError.message);
    }

    res.status(201).json({ success: true, data: savedEntry });
  } catch (error) {
    console.error('Error logging entry:', error);
    res.status(500).json({ error: 'Failed to process entry' });
  }
};

exports.getEntries = async (req, res) => {
  try {
    // If DB is connected, fetch from DB
    const entries = await DiaryEntry.find().sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error) {
    console.warn("Database fetch failed, returning empty array:", error.message);
    res.status(200).json({ success: true, data: [] });
  }
};
