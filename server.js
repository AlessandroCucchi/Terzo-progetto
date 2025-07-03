require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const url = "https://hacker-news.firebaseio.com/v0/newstories.json";

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/news", async (req, res) => {
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
