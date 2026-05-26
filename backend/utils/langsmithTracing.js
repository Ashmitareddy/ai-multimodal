const { traceable } = require('langsmith/traceable');

const formatPrompt = traceable(
  (subject) => {
    return subject;
  },
  { name: 'formatPrompt' }
);

const invokeLLM = traceable(
  async (messages, llmCall) => {
    return await llmCall(messages);
  },
  { run_type: 'llm', name: 'invokeLLM' }
);

const parseOutput = traceable(
  (response) => {
    try {
      // Find the first JSON block or try to parse directly
      const text = response.text || response;
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}') + 1;
      if (start >= 0 && end > start) {
        return JSON.parse(text.substring(start, end));
      }
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse output", e, response);
      return { error: 'Failed to parse JSON' };
    }
  },
  { name: 'parseOutput' }
);

const runPipeline = traceable(
  async (input, llmCall) => {
    const messages = await formatPrompt(input);
    const response = await invokeLLM(messages, llmCall);
    return parseOutput(response);
  },
  { name: 'runPipeline' }
);

module.exports = {
  formatPrompt,
  invokeLLM,
  parseOutput,
  runPipeline
};
