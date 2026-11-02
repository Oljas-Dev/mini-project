import express from "express";
import autheticateJWT from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", autheticateJWT, (req, res) => {
  const { content } = req.body;

  res.status(201).json({
    message: "Content was added",
    content,
  });
});

router.get("/", (req, res) => {
  res.send("posts get works");
});

// router.delete("/delete", (req, res) => {});

export default router;
