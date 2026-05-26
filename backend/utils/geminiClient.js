const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
}) : null;

async function getGeminiVisionCompletion(base64Image) {
  if (!ai) throw new Error("GEMINI_API_KEY is not configured.");

  // Extract mime type and base64 data
  const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let mimeType = 'image/jpeg';
  let data = base64Image;

  if (matches && matches.length === 3) {
    mimeType = matches[1];
    data = matches[2];
  }

  const prompt = `Analyze this image and return a strict JSON object with three fields:
1. 'color_palette': an array of 3 dominant hex color codes representing the image.
2. 'aesthetic_tag': a short phrase describing the visual vibe (e.g., 'Y2K Grunge', 'Minimalist Cafe', 'Golden Hour').
3. 'caption': a creative, auto-generated caption for this photo dump.
Do not return markdown, only the raw JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: data,
              mimeType: mimeType
            }
          }
        ]
      }
    ]
  });

  return response.text;
}

module.exports = { getGeminiVisionCompletion };
