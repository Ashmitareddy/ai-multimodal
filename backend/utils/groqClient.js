const Groq = require('groq-sdk');
require('dotenv').config();

const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY
}) : null;

async function getGroqChatCompletion(prompt) {
  if (!groq) throw new Error("GROQ_API_KEY is not configured.");
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an AI that analyzes a short diary entry and returns a strict JSON object with two fields: 'emotion_tag' (a single descriptive word like 'Nostalgic', 'Stressed', 'Hyped') and 'summary' (a one-sentence supportive or witty summary of the entry). Do not return markdown, only the raw JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.3-70b-versatile", // Using an available Groq LLaMA 3 model
  });
  return response.choices[0]?.message?.content || "";
}

module.exports = { getGroqChatCompletion };
