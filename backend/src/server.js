const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.config");
const errorHandler = require("./middlewares/error.middleware");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require("./routes/auth.routes");
const products = require("./routes/product.routes");
const inventoryHistory = require("./routes/inventoryHistory.routes");
const { CLIENT_URL } = require("./config/env.config");

const app = express();

console.log("newwww change")
// Enable CORS
const corsOptions = {
  origin: `${CLIENT_URL}`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Request method: ${req.method}, URL: ${req.url}`);
  next();
});

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploaded_data')));

// Mount routers
app.use("/api/auth", auth);
app.use("/api/products", products);
app.use("/api/products", inventoryHistory);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
