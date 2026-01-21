const { pool } = require("../database/db");
const { StatusCodes } = require("http-status-codes");

/* =============== GET ALL ANSWERS FOR QUESTION ============ */
const getAnswersForQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId; // UUID string

    const [rows] = await pool.query(
      `SELECT 
          a.answer_id,
          a.question_id,
          a.user_id,
          a.content,
          a.created_at,
          u.username AS user_name
       FROM answers a
       JOIN users u ON u.user_id = a.user_id
       WHERE a.question_id = ?
       ORDER BY a.created_at DESC`,
      [questionId]
    );

    res.status(StatusCodes.OK).json({ answers: rows });

  } catch (error) {
    console.error("GET ANSWERS ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


/* =============== CREATE ANSWER ======================== */
const createAnswer = async (req, res) => {
  try {
    const { questionid, answer } = req.body;

    if (!questionid || !answer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Answer required" });
    }

    // Find question owner
    const [questionRows] = await pool.query(
      "SELECT user_id FROM questions WHERE question_id = ?",
      [questionid]
    );

    if (questionRows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
    }

    const questionOwnerId = questionRows[0].user_id;
    const currentUserId = req.user.userid;

    // Prevent answering own question
    if (questionOwnerId === currentUserId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "You cannot answer your own question"
      });
    }

    await pool.query(
      "INSERT INTO answers (question_id, user_id, content) VALUES (?, ?, ?)",
      [questionid, currentUserId, answer]
    );

    res.status(StatusCodes.CREATED).json({ msg: "Answer created" });

  } catch (error) {
    console.error("CREATE ANSWER ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};


/* =============== UPDATE ANSWER ======================= */
const updateAnswer = async (req, res) => {
  try {
    const answerId = Number(req.params.answerId);
    const { content } = req.body;
    const userId = req.user.userid;

    if (!content) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Content required" });
    }

    const [result] = await pool.query(
      "UPDATE answers SET content=? WHERE answer_id=? AND user_id=?",
      [content, answerId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "Not authorized to edit this answer"
      });
    }

    res.status(StatusCodes.OK).json({ msg: "Answer updated" });

  } catch (error) {
    console.error("UPDATE ANSWER ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


/* ================== DELETE ANSWER ========================= */
const deleteAnswer = async (req, res) => {
  try {
    const answerId = Number(req.params.answerId);
    const userId = req.user.userid;

    const [result] = await pool.query(
      "DELETE FROM answers WHERE answer_id=? AND user_id=?",
      [answerId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "Not authorized to delete this answer"
      });
    }

    res.status(StatusCodes.OK).json({ msg: "Answer deleted" });

  } catch (error) {
    console.error("DELETE ANSWER ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


/* ================================
   GET COMMENTS
================================== */
const getAnswerComments = async (req, res) => {
  try {
    const answerId = Number(req.params.answerId);

    const [rows] = await pool.query(
      `SELECT 
          c.comment_id,
          c.answer_id,
          c.user_id,
          c.content,
          u.username AS user_name
       FROM answer_comments c
       JOIN users u ON u.user_id = c.user_id
       WHERE c.answer_id=? 
       ORDER BY c.created_at DESC`,
      [answerId]
    );

    res.status(StatusCodes.OK).json({ comments: rows });

  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


/* ================================
   ADD COMMENT
================================== */
const addAnswerComment = async (req, res) => {
  try {
    const answerId = Number(req.params.answerId);
    const { content } = req.body;

    if (!content) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Comment required" });
    }

    await pool.query(
      "INSERT INTO answer_comments (answer_id, user_id, content) VALUES (?, ?, ?)",
      [answerId, req.user.userid, content]
    );

    res.status(StatusCodes.CREATED).json({ msg: "Comment added" });

  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


/* ================================
   DELETE COMMENT
================================== */
const deleteAnswerComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user.userid;

    const [result] = await pool.query(
      "DELETE FROM answer_comments WHERE comment_id=? AND user_id=?",
      [commentId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "Not authorized to delete this comment"
      });
    }

    res.status(StatusCodes.OK).json({ msg: "Comment deleted" });

  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


module.exports = {
  getAnswersForQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  getAnswerComments,
  addAnswerComment,
  deleteAnswerComment
};
