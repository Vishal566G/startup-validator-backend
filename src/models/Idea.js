const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  report: {
    problem: String,
    customer: String,
    market: String,
    competitor: [
      {
        name: String,
        differentiation: String,
      },
    ],
    tech_stack: [String],
    risk_level: String,
    profitability_score: Number,
    justification: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Idea", IdeaSchema);
