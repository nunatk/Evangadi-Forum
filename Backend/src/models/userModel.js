const db = require("../database/db");

const createUser = async ({ username, email, password }) => {
  return db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password]
  );
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

module.exports = {
  createUser,
  getUserByEmail
};
