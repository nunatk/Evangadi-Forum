const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  askQuestion,
  allQuestions,
  singleQuestion,
  updateQuestion,
  deleteQuestion,
  searchQuestions
} = require("../controllers/questionController");

/* Create question */
router.post("/", auth, askQuestion);

/* Get all paginated questions */
router.get("/", auth, allQuestions);

/* Search questions — MUST come before "/:id" */
router.get("/search", auth, searchQuestions);

/* Get single question by UUID */
router.get("/:id", auth, singleQuestion);

/* Update question */
router.put("/:id", auth, updateQuestion);

/* Delete question */
router.delete("/:id", auth, deleteQuestion);

module.exports = router;
