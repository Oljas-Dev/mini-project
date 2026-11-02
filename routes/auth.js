import express from "express";
import bcrypt from "bcrypt";
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

router.post("/login", (req, res) => {
  res.send("auth login works");
});

export default router;
