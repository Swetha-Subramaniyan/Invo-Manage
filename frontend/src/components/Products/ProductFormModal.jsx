import React, { useState, useEffect } from "react";
import productService from "../../services/productService";
import { IoCloseCircle } from "react-icons/io5";

const ProductFormModal = ({ product, onClose, refreshProducts }) => {
  const [formData, setFormData] = useState({
    name: "",
    unit: "piece",
    category: "Other",
    brand: "",
    stock: 0,
    image: null, // Change to null for file upload
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        unit: product.unit,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        image: null, // Keep as null for file input
      });
      setPreviewImage(product.image || "");
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      
      // Append all form data
      submitData.append('name', formData.name);
      submitData.append('unit', formData.unit);
      submitData.append('category', formData.category);
      submitData.append('brand', formData.brand);
      submitData.append('stock', formData.stock.toString());
      
      // Append image if selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (product) {
        await productService.updateProduct(product._id, submitData);
      } else {
        await productService.createProduct(submitData);
      }
      
      refreshProducts();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewImage("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{product ? "Edit Product" : "Add New Product"}</h3>
          <button className="btn-icon" onClick={onClose}>
            <IoCloseCircle />
            </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit *</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="piece">Piece</option>
              <option value="kg">Kilogram</option>
              <option value="g">Gram</option>
              <option value="l">Liter</option>
              <option value="ml">Milliliter</option>
              <option value="box">Box</option>
              <option value="pack">Pack</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Toys">Toys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Brand *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Image</label>
            {previewImage ? (
              <div className="image-preview-container">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="image-preview"
                />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="remove-image-btn"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
            )}
          </div>

          <div className="btn-group">
            <button
              type="button"
              onClick={onClose}
              className="btn-customized"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-customized" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
