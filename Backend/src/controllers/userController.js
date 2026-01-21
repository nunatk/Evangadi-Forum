const { StatusCodes } = require("http-status-codes");
const { pool } = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ===================== REGISTER ===================== */
const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstname, lastname } = req.body;

    // Check required fields
    if (!username || !email || !password || !firstname || !lastname) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "All fields are required"
      });
    }

    // Password length restriction
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Password must be at least 8 characters long"
      });
    }

    // Check if user exists
    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        msg: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    res.status(StatusCodes.CREATED).json({
      msg: "User registered successfully"
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Server error"
    });
  }
};


/* ===================== LOGIN ===================== */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // User not found
    if (rows.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "USER_NOT_FOUND"
      });
    }

    const user = rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "PASSWORD_INCORRECT"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userid: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({ token });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Server error"
    });
  }
};


/* ===================== CHECK USER ===================== */
const checkUser = async (req, res) => {
  try {
    const { userid } = req.user;

    const [rows] = await pool.query(
      "SELECT user_id AS userid, username, firstname, lastname, email FROM users WHERE user_id = ?",
      [userid]
    );

    if (!rows.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "User not found"
      });
    }

    res.status(StatusCodes.OK).json(rows[0]);

  } catch (error) {
    console.error("CHECK USER ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Server error"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  checkUser
};
