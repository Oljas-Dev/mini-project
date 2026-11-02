import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.send("posts create works");
});

router.get("/", (req, res) => {
  res.send("posts get works");
});

// router.delete("/delete", (req, res) => {});

export default router;
