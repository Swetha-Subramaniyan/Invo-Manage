const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit'],
    enum: ['kg', 'g', 'l', 'ml', 'piece', 'box', 'pack']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Other']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true,
    maxlength: [30, 'Brand cannot be more than 30 characters']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  status: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Update status based on stock before save
ProductSchema.pre('save', function(next) {
  if (this.stock <= 0) {
    this.status = 'Out of Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);