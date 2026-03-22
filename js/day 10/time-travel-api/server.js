require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

// connect database
connectDB();

// middleware
app.use(express.json());

// auth routes
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Time Travel API is running");
});

// protected route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});