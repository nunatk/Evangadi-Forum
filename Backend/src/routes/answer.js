const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getAnswersForQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  getAnswerComments,
  addAnswerComment,
  deleteAnswerComment
} = require("../controllers/answerController");

/* Answers */
router.get("/:questionId", auth, getAnswersForQuestion);
router.post("/", auth, createAnswer);
router.put("/:answerId", auth, updateAnswer);
router.delete("/:answerId", auth, deleteAnswer);

/* Answer Comments */
router.get("/:answerId/comments", auth, getAnswerComments);
router.post("/:answerId/comments", auth, addAnswerComment);
router.delete("/comments/:commentId", auth, deleteAnswerComment);

module.exports = router;
