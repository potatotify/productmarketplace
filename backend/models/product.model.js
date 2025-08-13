const { pool } = require('../config/db');

const productTableSQL = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createProduct = async (productData) => {
  const { name, description, price, category_id, user_id, image_url } = productData;
  const [result] = await pool.execute(
    'INSERT INTO products (name, description, price, category_id, user_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, category_id, user_id, image_url]
  );
  return result.insertId;
};

const getAllProducts = async () => {
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as category_name, u.username as creator_name
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `);
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as category_name, u.username as creator_name
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `, [id]);
  return rows[0];
};

const getProductsByCategory = async (categoryId) => {
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as category_name, u.username as creator_name
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    JOIN users u ON p.user_id = u.id
    WHERE p.category_id = ?
    ORDER BY p.created_at DESC
  `, [categoryId]);
  return rows;
};

const updateProduct = async (id, productData) => {
  const { name, description, price, category_id, image_url } = productData;
  const [result] = await pool.execute(
    'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?',
    [name, description, price, category_id, image_url, id]
  );
  return result.affectedRows > 0;
};

const deleteProduct = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM products WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  productTableSQL,
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct
};
