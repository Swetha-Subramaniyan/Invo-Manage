import React, { useState, useEffect } from "react";
import ProductSearch from "./ProductSearch";
import ProductTable from "./ProductTable";
import ImportExport from "./ImportExport";
import InventoryHistory from "./InventoryHistory";
import ProductFormModal from "./ProductFormModal";
import productService from "../../services/productService";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedViewHistoryProduct, setselectedViewHistoryProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProducts(products);
      setCurrentPage(1);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (category) => {
    if (!category) {
      setFilteredProducts(products);
      setCurrentPage(1);
      return;
    }
    const filtered = products.filter(
      (product) => product.category === category
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (product) => {

    console.log("sssss", product)
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

   const handleViewHistory = (product) => {
    setselectedViewHistoryProduct(product);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="text-animation">Product Management</h2>
        <ProductSearch
          onSearch={handleSearch}
          onFilter={handleFilter}
          onAddProduct={handleAddProduct}
        />
      </div>

      <ImportExport refreshProducts={fetchProducts} />

      {loading ? (
        <div className="loading-spinner">Loading products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <ProductTable
            products={currentProducts}
            onEdit={handleEdit}
            onViewHistory={handleViewHistory}
            refreshProducts={fetchProducts}
            selectedViewHistoryProduct={selectedViewHistoryProduct} 
  setSelectedViewHistoryProduct={setselectedViewHistoryProduct}
          />

          {/* Pagination controls */}
          {filteredProducts.length > productsPerPage && (
            <div className="paginate">
              <h5>
                Showing {indexOfFirstProduct + 1} {" "}–{" "}
                {Math.min(indexOfLastProduct, filteredProducts.length)}{" "}
                of {filteredProducts.length} entries
              </h5>
              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="btn-customized"
                >
                  Previous
                </button>
                <h5>
                  Page {currentPage} of {totalPages}
                </h5>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="btn-customized"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {selectedViewHistoryProduct && (
            <InventoryHistory productId={selectedViewHistoryProduct._id} />
          )}
        </>
      )}

      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          onClose={handleCloseModal}
          refreshProducts={fetchProducts}
        />
      )}
    </div>
  );
};

export default ProductDashboard;
