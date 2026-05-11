require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   CONFIG
========================= */
const TMDB = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_KEY;

/* =========================
   HEALTH CHECK (for deploy)
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "TMDB Proxy API is running 🚀"
  });
});

/* =========================
   FIXED PROXY ROUTE
========================= */
app.use("/api", async (req, res) => {
  try {
    // remove /api prefix safely
    const path = req.originalUrl.replace("/api", "");

    const url = `${TMDB}${path}`;

    const response = await axios.get(url, {
      params: {
        api_key: API_KEY,
        ...req.query
      },
      timeout: 10000
    });

    res.json(response.data);

  } catch (err) {
    console.log("❌ ERROR:", err.message);

    res.status(err.response?.status || 500).json({
      error: "Proxy error",
      message: err.message
    });
  }
});

/* =========================
   START SERVER (IMPORTANT FOR DEPLOY)
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});