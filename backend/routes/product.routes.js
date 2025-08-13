const express = require('express');
const { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  getProductsByCategory, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);

// Protected routes (admin only)
router.post('/', protect,  createProduct);
router.put('/:id', protect,  updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
