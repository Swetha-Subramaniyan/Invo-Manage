import React, { useState } from 'react';
import productService from '../../services/productService';

const ImportExport = ({ refreshProducts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await productService.importProducts(formData);
      refreshProducts();
      setSuccess(`Successfully imported ${result.addedCount} products. ${result.skippedCount} skipped.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
      e.target.value = ''; 
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await productService.exportProducts();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setSuccess('Products exported successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-export-container">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="btn-group">
        <label className="btn-customized">
          {loading ? 'Processing...' : 'Import'}
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleImport}
            disabled={loading}
            style={{ display: 'none' }}
            className='form-control'
          />
        </label>
        
        <button 
          onClick={handleExport}
          className="btn-customized"
          disabled={loading}
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default ImportExport;