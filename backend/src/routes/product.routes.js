const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProducts,
  searchProducts,
  importProducts,
  exportProducts,
} = require("../controllers/product.controller");
const { protect } = require("../middlewares/auth.middleware");
const {upload, uploadProductImage} = require('../middlewares/fileUpload.middleware');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Private
 * @query   {page, limit, sort, category, etc.}
 */
router
  .route("/")
  .get(protect, getProducts)
  /**
   * @route   POST /api/products
   * @desc    Create new product
   * @access  Private
   * @body    {name, unit, category, brand, stock, image}
   */
  .post(protect,  uploadProductImage.single('image') , createProduct);

/**
 * @route   GET /api/products/search
 * @desc    Search products by name
 * @access  Private
 * @query   {name}
 */
router.route("/search").get(protect, searchProducts);

/**
 * @route   POST /api/products/import
 * @desc    Import products from CSV
 * @access  Private
 * @file    CSV file with product data
 */
router.post('/import',protect, upload.single('file'), importProducts);

/**
 * @route   GET /api/products/export
 * @desc    Export products to CSV
 * @access  Private
 */
router.route("/export").get(protect, exportProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Private
 */
router
  .route("/:id")
  .get(protect, getProduct)
  /**
   * @route   PUT /api/products/:id
   * @desc    Update product
   * @access  Private
   * @body    {fields to update}
   */
  .put(protect, updateProduct)
  /**
   * @route   DELETE /api/products/:id
   * @desc    Delete product
   * @access  Private
   */
  .delete(protect, deleteProduct);

/**
 * @route   GET /api/products/delete-man
 * @desc    Delete Multiple Products
 * @access  Private
 */
router.route("/delete-many").post(protect, deleteManyProducts);

module.exports = router;
