const {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} = require('../models/product.model');

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// CREATE PRODUCT with Cloudinary image upload
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;
    const user_id = req.user.id;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        message: 'Product name, price, and category are required',
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        message: 'Price must be a positive number',
      });
    }

    let image_url = null;

    // If an image file is included, upload to Cloudinary
    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' }, // optional folder in Cloudinary
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        image_url = uploadResult.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    // Save to DB (with image_url if present)
    const productId = await createProduct({
      name,
      description,
      price,
      category_id,
      user_id,
      image_url,
    });

    const product = await getProductById(productId);

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json({
      message: 'Products retrieved successfully',
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product retrieved successfully',
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET PRODUCTS BY CATEGORY
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await getProductsByCategory(categoryId);

    res.json({
      message: 'Products retrieved successfully',
      products,
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE PRODUCT (supports image replacement)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        message: 'Product name, price, and category are required',
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        message: 'Price must be a positive number',
      });
    }

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let image_url = product.image_url;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      image_url = uploadResult.secure_url;
    }

    const success = await updateProduct(id, { name, description, price, category_id, image_url });

    if (!success) {
      return res.status(500).json({ message: 'Failed to update product' });
    }

    const updatedProduct = await getProductById(id);
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.user_id !== user_id) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    const success = await deleteProduct(id);
    if (!success) {
      return res.status(500).json({ message: 'Failed to delete product' });
    }

    res.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
