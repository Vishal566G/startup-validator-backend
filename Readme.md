# Startup Idea Validator — Backend

Express + Node.js backend with MongoDB and Anthropic AI integration.

## Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- Anthropic Claude API
- dotenv, cors, axios

## Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Anthropic API key

### Installation

```bash
npm install
```

Create a `.env` file in `/server`:

```
MONGO_URI=your_mongodb_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=5000
```

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint   | Description                       |
| ------ | ---------- | --------------------------------- |
| POST   | /ideas     | Submit idea + trigger AI analysis |
| GET    | /ideas     | Get all ideas                     |
| GET    | /ideas/:id | Get full report by ID             |
| DELETE | /ideas/:id | Delete an idea                    |

## AI Prompt Used

You are an expert startup consultant. Analyze the given startup idea and return a structured JSON object with the fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification.
Rules:

Keep answers concise and realistic.
'competitor' should be an array of exactly 3 objects, each with 'name' and 'differentiation' fields.
'tech_stack' should be an array of 4-6 practical technologies for MVP.
'profitability_score' must be an integer between 0-100.
'risk_level' must be one of: Low, Medium, High.
Return ONLY valid JSON. No explanation, no markdown, no backticks.

Input: { "title": "", "description": "" }

## Deployment

Deployed on Render. Add all environment variables in Render dashboard before deploying.
