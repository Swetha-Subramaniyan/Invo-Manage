const multer = require('multer');
const { storage, imageFileFilter } = require('../config/cloudinary.config');
const path = require('path');
const fs = require('fs');


const uploadDir = path.join(__dirname, '../uploaded_data/csv_files');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const csvFileFilter = (req, file, cb) => {
  const filetypes = /csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

const uploadCSV = multer({
  storage: csvStorage,
  fileFilter: csvFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
});

const uploadProductImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 
  }
});

module.exports = {
  uploadCSV,
  uploadProductImage
};