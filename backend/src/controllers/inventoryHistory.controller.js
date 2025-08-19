const InventoryHistory = require("../../models/InventoryHistory.model");

// @desc    Get inventory history for a product
// @route   GET /api/products/:productId/history
// @access  Private
const getInventoryHistory = async (req, res, next) => {
  try {
    const history = await InventoryHistory.find({
      product: req.params.productId,
    })
      .sort("-createdAt")
      .populate("user", "username");

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventoryHistory,
};
