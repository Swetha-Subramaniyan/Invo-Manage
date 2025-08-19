const Product = require("../../models/Product.model");
const InventoryHistory = require("../../models/InventoryHistory.model");
const ErrorResponse = require("../utils/errorResponse.util");
const parseCSV = require("../utils/csvParser.util");
const cloudinary = require("../config/cloudinary.config.js");
const fs = require("fs");
const csv = require("csv-parser");

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
  // Search functionality
  let query;
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Product.find(JSON.parse(queryStr)).populate("user", "username");

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Executing query
  const products = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products,
  });
};

// @desc    Search products by name
// @route   GET /api/products/search
// @access  Private
const searchProducts = async (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return next(new ErrorResponse("Please provide a search term", 400));
  }

  const products = await Product.find({
    name: { $regex: name, $options: "i" },
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "user",
    "username"
  );

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  if (req.file) {
    req.body.image = req.file.path; // Cloudinary URL
    req.body.imagePublicId = req.file.filename; // Cloudinary public_id
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is product owner
  if (product.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this product`,
        401
      )
    );
  }

  if (req.file) {
    // Delete old image from Cloudinary if exists
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    req.body.image = req.file.path;
    req.body.imagePublicId = req.file.filename;
  }

  // Save old stock for history
  const oldStock = product.stock;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Create inventory history if stock changed
  if (req.body.stock !== undefined && req.body.stock !== oldStock) {
    await InventoryHistory.create({
      product: product._id,
      oldQuantity: oldStock,
      newQuantity: req.body.stock,
      user: req.user.id,
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  if (product.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this product`,
        401
      )
    );
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc    Delete Multiple products
// @route   DELETE /api/products/:id
// @access  Private
const deleteManyProducts = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return next(
      new ErrorResponse("Please provide an array of product IDs", 400)
    );
  }

  const result = await Product.deleteMany({
    _id: { $in: ids },
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: {},
    message: `Deleted ${result.deletedCount} products`,
  });
};

// @desc    Import products from CSV
// @route   POST /api/products/import
// @access  Private
const importProducts = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const results = [];
  let skippedCount = 0;
  let emptyRowCount = 0;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const isEmptyRow =
        !row.Name ||
        !row.Name.trim() ||
        Object.values(row).every((value) => !value || !value.toString().trim());

      if (isEmptyRow) {
        emptyRowCount++;
        return;
      }

      results.push({
        name: row.Name.trim(),
        unit: row.Unit ? row.Unit.trim() : "",
        category: row.Category ? row.Category.trim() : "",
        brand: row.Brand ? row.Brand.trim() : "",
        stock: parseInt(row.Stock) || 0,
        status: row.Status ? row.Status.trim() : "",
        image: row.Image ? row.Image.trim() : "",
        user: req.user.id,
      });
    })
    .on("end", async () => {
      try {
        const addedProducts = [];

        for (const productData of results) {
          const exists = await Product.findOne({ name: productData.name });
          if (exists) {
            skippedCount++;
            continue;
          }
          const newProduct = await Product.create(productData);
          addedProducts.push(newProduct);
        }

        fs.unlinkSync(filePath);

        res.json({
          addedCount: addedProducts.length,
          skippedCount: skippedCount,
          emptyRowCount: emptyRowCount,
        });
      } catch (err) {
        fs.unlinkSync(filePath);
        res.status(500).json({ message: err.message });
      }
    })
    .on("error", (err) => {
      fs.unlinkSync(filePath);
      res.status(500).json({ message: err.message });
    });
};

// @desc    Export products to CSV
// @route   GET /api/products/export
// @access  Private
const exportProducts = async (req, res, next) => {
  const products = await Product.find({ user: req.user.id });

  if (!products || products.length === 0) {
    return next(new ErrorResponse("No products found", 404));
  }

  // Convert products to CSV
  let csv = "Name,Unit,Category,Brand,Stock,Status,Image\n";

  products.forEach((product) => {
    csv += `"${product.name}",${product.unit},${product.category},${product.brand},${product.stock},${product.status},${product.image}\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=products.csv");
  res.status(200).end(csv);
};

module.exports = {
  getProducts,
  searchProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProducts,
  importProducts,
  exportProducts,
};
