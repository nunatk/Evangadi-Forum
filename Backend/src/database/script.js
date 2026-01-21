const fs = require("fs");
const path = require("path");
const { pool } = require("./db");
console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASSWORD ? "Loaded" : "Missing");
console.log("DB:", process.env.DB_NAME);

async function script() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    await pool.query(sql);
    console.log("Tables created successfully.");
    process.exit();
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
}

script();
