import React, { useState, useEffect } from "react";
import productService from "../../services/productService";

const ProductTable = ({
  products,
  refreshProducts,
  onEdit,
  onViewHistory,
  selectedViewHistoryProduct,
  setSelectedViewHistoryProduct,
}) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      selectedViewHistoryProduct &&
      !selectedProducts.includes(selectedViewHistoryProduct._id)
    ) {
      setSelectedViewHistoryProduct(null);
    }
  }, [
    selectedProducts,
    selectedViewHistoryProduct,
    setSelectedViewHistoryProduct,
  ]);

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDelete = async (ids) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${
          ids.length > 1 ? "these products" : "this product"
        }?`
      )
    ) {
      setLoading(true);
      try {
        if (ids.length === 1) {
          await productService.deleteProduct(ids[0]);
        } else {
          await productService.deleteManyProducts(ids);
        }
        refreshProducts();
        setSelectedProducts([]);
      } catch (err) {
        setError(err.response?.data?.message || "Delete failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="product-table-container">
      {error && <div className="error-message">{error}</div>}

      {/* Action buttons (shown only when products are selected) */}
      {selectedProducts.length > 0 && (
        <div className="btn-group">
          {selectedProducts.length === 1 && (
            <>
              <button
                onClick={() => {
                  const product = products.find(
                    (p) => p._id == selectedProducts
                  );
                  if (product) {
                    onEdit(product);
                  }
                }}
                className="btn-customized"
                disabled={loading}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  const product = products.find(
                    (p) => p._id == selectedProducts
                  );
                  if (product) {
                    onViewHistory(product);
                  }
                }}
                className="btn-customized"
                disabled={loading}
              >
                View History
              </button>
            </>
          )}
          <button
            onClick={() => handleDelete(selectedProducts)}
            className="btn-customized danger"
            disabled={loading}
          >
            Delete{" "}
            {selectedProducts.length > 1 ? `(${selectedProducts.length})` : ""}
          </button>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th></th>
            <th>Image</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              onClick={() => handleSelectProduct(product._id)}
              style={{ cursor: "pointer" }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={(e) => {
                    e.stopPropagation(); 
                    handleSelectProduct(product._id);
                  }}
                />
              </td>
              <td>
                <img
                  src={product.image || "/images/no-photo.jpg"}
                  alt={product.name}
                  className="product-image"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.unit}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>{product.stock}</td>
              <td>
                <span
                  className={`status-badge ${
                    product.status === "In Stock" ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
