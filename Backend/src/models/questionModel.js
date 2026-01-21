const db = require("../database/db");

const createQuestion = async ({ user_id, title, description }) => {
  return db.query(
    "INSERT INTO questions (user_id, title, content) VALUES (?, ?, ?)",
    [user_id, title, description]
  );
};

const getAllQuestions = async () => {
  const [rows] = await db.query(`
    SELECT q.*, u.username
    FROM questions q
    JOIN users u ON q.user_id = u.user_id
    ORDER BY q.created_at DESC
  `);
  return rows;
};

const getSingleQuestion = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM questions WHERE question_id = ?",
    [id]
  );
  return rows[0];
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion
};
