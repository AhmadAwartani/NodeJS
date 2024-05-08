const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const Admin = require("./Routes/adminRoutes");
const User = require("./Routes/userRoutes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

// Admin APIs
app.use("/admin", Admin);

// User APIs
app.use("/user", User);

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on PORT ${port}...`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });
