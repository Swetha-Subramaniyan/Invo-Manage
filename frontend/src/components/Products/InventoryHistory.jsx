import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';

const InventoryHistory = ({ productId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await productService.getInventoryHistory(productId);
      setHistory(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-history-container">
      <h2 className='text-animation' style={{marginBottom:"2rem"}}>Inventory History</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : history.length === 0 ? (
        <div>No history available</div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Old Quantity</th>
              <th>New Quantity</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item._id}>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>{item.user?.username || 'System'}</td>
                <td>{item.oldQuantity}</td>
                <td>{item.newQuantity}</td>
                <td className={item.newQuantity > item.oldQuantity ? 'positive-change' : 'negative-change'}>
                  {item.newQuantity > item.oldQuantity ? '+' : ''}
                  {item.newQuantity - item.oldQuantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryHistory;