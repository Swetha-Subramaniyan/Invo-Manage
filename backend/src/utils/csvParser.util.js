const csv = require('csv-parser');
const stream = require('stream');

/**
 * Parses CSV data into an array of product objects
 * @param {string} csvData - CSV file content as string
 * @returns {Promise<Array<Object>>} Promise resolving to array of product objects
 * @throws {Error} If CSV parsing fails
 * 
 * @example
 * parseCSV(csvString)
 *   .then(products => console.log(products))
 *   .catch(err => console.error(err));
 * 
 * Product object structure:
 * {
 *   name: string,
 *   unit: string,
 *   category: string,
 *   brand: string,
 *   stock: number,
 *   status: 'In Stock' | 'Out of Stock',
 *   image: string
 * }
 */


const parseCSV = (csvData) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const bufferStream = new stream.PassThrough();
    
    bufferStream.end(csvData);

    bufferStream
      .pipe(csv())
      .on('data', (data) => {
        // Normalize CSV data (handles both header cases: 'Name' or 'name')
        const product = {
          name: data.Name || data.name,
          unit: data.Unit || data.unit,
          category: data.Category || data.category,
          brand: data.Brand || data.brand,
          stock: parseInt(data.Stock || data.stock || 0),
          status: parseInt(data.Stock || data.stock || 0) > 0 ? 'In Stock' : 'Out of Stock',
          image: data.Image || data.image || 'no-photo.jpg'
        };
        results.push(product);
      })
      .on('end', () => {
        if (results.length === 0) {
          reject(new Error('CSV file is empty or invalid'));
        } else {
          resolve(results);
        }
      })
      .on('error', (err) => {
        reject(new Error(`Failed to parse CSV file: ${err.message}`));
      });
  });
};

module.exports = parseCSV;