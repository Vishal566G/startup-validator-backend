const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const ideaRoutes = require("./routes/ideas");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://startup-idea-validator-xi.vercel.app",
    ],
  }),
);
app.use(express.json());

app.use("/ideas", ideaRoutes);

const PORT = process.env.PORT || 50000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.log(err);
  });
