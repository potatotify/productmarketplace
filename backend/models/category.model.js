const { pool } = require('../config/db');

const categoryTableSQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const createCategory = async (categoryData) => {
  const { name, description } = categoryData;
  const [result] = await pool.execute(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description]
  );
  return result.insertId;
};

const getAllCategories = async () => {
  const [rows] = await pool.execute(
    'SELECT * FROM categories ORDER BY created_at DESC'
  );
  return rows;
};

const getCategoryById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
  return rows[0];
};

const updateCategory = async (id, categoryData) => {
  const { name, description } = categoryData;
  const [result] = await pool.execute(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );
  return result.affectedRows > 0;
};

const deleteCategory = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  categoryTableSQL,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
