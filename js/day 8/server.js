const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "mysecretkey";

/* ---------------- DATABASE ---------------- */

mongoose.connect("mongodb://127.0.0.1:27017/authdemo");

/* ---------------- USER MODEL ---------------- */

const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", UserSchema);

/* ---------------- REGISTER ---------------- */

app.post("/register", async (req, res) => {

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword
  });

  await user.save();

  res.json({ message: "User registered" });

});

/* ---------------- LOGIN ---------------- */

app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { userId: user._id },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });

});

/* ---------------- AUTH MIDDLEWARE ---------------- */

function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    res.status(401).json({ message: "Invalid token" });

  }

}

/* ---------------- PROTECTED ROUTE ---------------- */

app.get("/profile", authMiddleware, (req, res) => {

  res.json({
    message: "Welcome to protected route",
    user: req.user
  });

});

/* ---------------- SERVER ---------------- */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});