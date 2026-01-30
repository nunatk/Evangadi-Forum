require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user");
const questionRoutes = require("./routes/question");
const answerRoutes = require("./routes/answer");
const chatRoutes = require("./routes/chat");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://evangadi-forum-proj.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Evangadi API is running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
