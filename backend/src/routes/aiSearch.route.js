import express from "express";
import axios from "axios";
import genAI from "../lib/gemini.js";

const router = express.Router();

router.post("/ai-search", async (req, res) => {
  const { prompt } = req.body;

  try {
    // Use Gemini to generate a YouTube search query
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `Convert this user request into a clean YouTube search query. Return only the search query string.\n\nUser: "${prompt}"`
    );

    const searchQuery = result.response.text().trim().replace(/^"|"$/g, '');

    // Use YouTube API to search for a video
    const ytRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: searchQuery,
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 1,
        type: "video",
      },
    });

    const video = ytRes.data.items[0];
    if (!video) return res.status(404).json({ error: "No video found." });

    res.json({
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
      channel: video.snippet.channelTitle,
    });
  } catch (err) {
    console.error("AI search error:", err.message);
    res.status(500).json({ error: "AI search failed." });
  }
});

export default router;
