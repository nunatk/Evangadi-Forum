const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const { pool } = require("../database/db");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../middleware/auth");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userMessage = req.body.message;
    const askerUserId = req.user.userid;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const BOT_USER_ID = Number(process.env.BOT_USER_ID);

    if (!BOT_USER_ID) {
      return res.status(500).json({
        reply: "Bot user is not configured. Please set BOT_USER_ID in .env"
      });
    }

    // 1) Save question (asked by the real user)
    const questionId = uuidv4();

    await pool.query(
      "INSERT INTO questions (question_id, user_id, title, content) VALUES (?, ?, ?, ?)",
      [questionId, askerUserId, userMessage, userMessage]
    );

    // 2) Ask OpenAI
    console.log("STEP 1 saved question");
    const aiResponse = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are Evangadi support assistant. Answer clearly and briefly. If the user asks about the forum, explain how to ask, answer, and navigate."
        },
        { role: "user", content: userMessage }
      ]
    });
    console.log("STEP 2 openai success");
    const aiReply = aiResponse.output?.[0]?.content?.[0]?.text || "I could not generate a response.";

    // 3) Save AI reply as answer (posted by the bot user)
    await pool.query(
      "INSERT INTO answers (question_id, user_id, content) VALUES (?, ?, ?)",
      [questionId, BOT_USER_ID, aiReply]
    );

    // 4) Return reply for the chat UI
    res.json({
      reply: aiReply,
      savedQuestionId: questionId
    });
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);
    res.status(500).json({
      reply: "Support is currently unavailable. Please try again later."
    });
  }
});

module.exports = router;
