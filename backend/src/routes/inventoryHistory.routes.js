const express = require('express');
const {
  getInventoryHistory
} = require('../controllers/inventoryHistory.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   GET /api/products/:productId/history
 * @desc    Get inventory history for a product
 * @access  Private
 * @query   {limit - optional limit of records}
 */
router.route('/:productId/history')
  .get(protect, getInventoryHistory);

module.exports = router;