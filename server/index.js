const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
const { mongoose } = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database is Connected."))
  .catch((err) => console.log("Database is not Connected."));

app.use(express.json());
app.use("/", require("./Routes/authRoutes"));

const port = 8000;
app.listen(port, () => console.log(`Server is running on the poart ${port}`));
