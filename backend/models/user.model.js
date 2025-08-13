const {pool} = require("../config/db");

const userTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const createUser = async (userData) => {
  const {username, password, role = "user"} = userData;
  const [result] = await pool.execute(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role]
  );
  return result.insertId;
};

const findUserByUsername = async (username) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE username = ?", [
    username
  ]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT id, username, role, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

module.exports = {
  userTableSQL,
  createUser,
  findUserByUsername,
  findUserById
};
