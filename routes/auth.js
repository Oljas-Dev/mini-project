import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUsersCollection } from "../db/config.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: "Valid username and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const usersCollection = getUsersCollection();

    const existingUser = await usersCollection.findOne({
      username: username.trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await usersCollection.insertOne({
      username: username.trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User successfully registered!",
      userId: newUser.insertedId,
    });
  } catch (err) {
    console.error("Registration error:", err);

    res.status(500).json({
      message: "Registration failed!",
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // 2. Find user in MongoDB
    const usersCollection = getUsersCollection();

    const user = await usersCollection.findOne({
      username: username.trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // 3. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // 4. Successful login
    const token = jwt.sign(
      {
        message: "Login successful!",
        user: { id: user._id, username: user.username },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      message: "Login failed!",
    });
  }
});

export default router;
