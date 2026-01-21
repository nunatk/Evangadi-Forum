const db = require("../database/db");

const createAnswer = async ({ user_id, question_id, answer }) => {
  return db.query(
    "INSERT INTO answers (user_id, question_id, content) VALUES (?, ?, ?)",
    [user_id, question_id, answer]
  );
};

const getAnswersByQuestionId = async (question_id) => {
  const [rows] = await db.query(
    `
    SELECT a.*, u.username 
    FROM answers a
    JOIN users u ON a.user_id = u.user_id
    WHERE a.question_id = ?
    ORDER BY a.created_at DESC
    `,
    [question_id]
  );

  return rows;
};

module.exports = {
  createAnswer,
  getAnswersByQuestionId
};
