const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database is Connected."))
  .catch((err) => console.log("Database is not Connected.", err));

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
app.use(
  cors({
    origin: "https://pro-manage-app-azure.vercel.app",
    credentials: true,
  })
);

// Custom middleware to add headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://pro-manage-app-azure.vercel.app"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Routes
app.use("/", require("./Routes/authRoutes"));

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
