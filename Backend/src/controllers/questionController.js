const { pool } = require("../database/db");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

/* CREATE QUESTION */
const askQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userid;
    const questionId = uuidv4();

    if (!title || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Title and description are required"
      });
    }

    await pool.query(
      "INSERT INTO questions (question_id, user_id, title, content) VALUES (?, ?, ?, ?)",
      [questionId, userId, title, description]
    );

    res.status(StatusCodes.CREATED).json({
      message: "Question added successfully",
      question_id: questionId
    });

  } catch (error) {
    console.error("ASK QUESTION ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


/* PAGINATED */
const allQuestions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    // Total count
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM questions"
    );

    // Paginated rows
    const [rows] = await pool.query(
      `
      SELECT 
        q.question_id,
        q.title,
        q.content,
        q.created_at,
        u.username
      FROM questions q
      JOIN users u ON q.user_id = u.user_id
      ORDER BY q.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    res.status(StatusCodes.OK).json({
      questions: rows,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("GET QUESTIONS ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};


/* SINGLE QUESTION */
const singleQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        q.question_id,
        q.title,
        q.content,
        q.created_at,
        u.username
      FROM questions q
      JOIN users u ON q.user_id = u.user_id
      WHERE q.question_id = ?
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found"
      });
    }

    res.status(StatusCodes.OK).json(rows[0]);

  } catch (error) {
    console.error("GET SINGLE QUESTION ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

/* UPDATE QUESTION */
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.userid;

    if (!title || !content) {
      return res.status(400).json({ msg: "Title and content required" });
    }

    const [result] = await pool.query(
      "UPDATE questions SET title=?, content=? WHERE question_id=? AND user_id=?",
      [title, content, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ msg: "Not authorized to edit this question" });
    }

    res.json({ msg: "Question updated" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};


/* DELETE QUESTION */
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userid;

    const [result] = await pool.query(
      "DELETE FROM questions WHERE question_id=? AND user_id=?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ msg: "Not authorized to delete this question" });
    }

    res.json({ msg: "Question deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

/* SEARCH QUESTIONS */
const searchQuestions = async (req, res) => {
  try {
    const search = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    // Count total matches
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total 
       FROM questions 
       WHERE title LIKE ? OR content LIKE ?`,
      [`%${search}%`, `%${search}%`]
    );

    // Fetch matching rows
    const [rows] = await pool.query(
      `SELECT 
        q.question_id,
        q.title,
        q.content,
        q.created_at,
        u.username
       FROM questions q
       JOIN users u ON q.user_id = u.user_id
       WHERE q.title LIKE ? OR q.content LIKE ?
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, limit, offset]
    );

    res.json({
      questions: rows,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};



module.exports = {
  askQuestion,
  allQuestions,
  singleQuestion,
  updateQuestion,
  deleteQuestion,
  searchQuestions
};
