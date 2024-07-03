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

// Routes
app.use("/", require("./Routes/authRoutes"));

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
