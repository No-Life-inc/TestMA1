import express from "express";
import dotenv from "dotenv";
import fakeInfoRoutes from "./routes/fakeInfoRoutes.js";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", fakeInfoRoutes);

app.listen(process.env.BACKEND_PORT, () => {
  console.log("Server is running on port", process.env.BACKEND_PORT);
});
