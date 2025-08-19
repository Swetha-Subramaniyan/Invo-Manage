import React, { useState } from "react";

const ProductSearch = ({ onSearch, onFilter, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    onFilter(selectedCategory);
  };

  return (
    <div className="product-search-container">
      <div  >
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
          <button type="submit" className="btn-customized">Search</button>
        </form>
      </div>
      <div>
        <select
          value={category}
          onChange={handleFilterChange}
          className="form-control"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
          <option value="Toys">Toys</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <button onClick={onAddProduct} className="btn-customized">
          Add New Product
        </button>
      </div>
    </div>
  );
};

export default ProductSearch;
