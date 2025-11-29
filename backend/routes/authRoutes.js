import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Spotify integration removed: helper and endpoints deleted

// Signup
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log("User created successfully:", user._id);
    res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Spotify integration endpoints removed

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    console.log("User logged in successfully:", user._id);
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
