import express from "express";
import dotenv from "dotenv/config";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/posts.js";
import { connectToDatabase } from "./db/config.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", postRouter);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start the server due to mongoDB connection issue",
      err,
    );
  });
