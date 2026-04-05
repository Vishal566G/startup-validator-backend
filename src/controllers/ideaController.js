const Idea = require("../models/Idea");
const axios = require("axios");

// Build the prompt
const buildPrompt = (title, description) => {
  return `You are an expert startup consultant. Analyze the given startup idea and return a structured JSON object with the fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification.

Rules:
- Keep answers concise and realistic.
- 'competitor' should be an array of exactly 3 objects, each with 'name' and 'differentiation' fields.
- 'tech_stack' should be an array of 4-6 practical technologies for MVP.
- 'profitability_score' must be an integer between 0-100.
- 'risk_level' must be one of: Low, Medium, High.
- Return ONLY valid JSON. No explanation, no markdown, no backticks.

Input: ${JSON.stringify({ title, description })}`;
};

// POST /ideas
const createIdea = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    // Call Anthropic API
    const aiResponse = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: buildPrompt(title, description),
          },
        ],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      },
    );

    // Extract and parse the JSON from AI response
    const rawText = aiResponse.data.content[0].text;
    const report = JSON.parse(rawText);

    // Save to MongoDB
    const idea = await Idea.create({ title, description, report });

    res.status(201).json(idea);
  } catch (err) {
    // Check if the error came from the axios call to Anthropic
    if (err.response) {
      console.error("Anthropic API Error:", err.response.data);
      return res.status(err.response.status).json(err.response.data);
    }
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// GET /ideas
const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()
      .select("title description createdAt")
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// GET /ideas/:id
const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// DELETE /ideas/:id
const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    res.json({ message: "Idea deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { createIdea, getIdeas, getIdeaById, deleteIdea };
