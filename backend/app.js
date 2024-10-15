import express from "express";
import dotenv from "dotenv";
import fakeInfoRoutes from "./routes/fakeInfoRoutes.js";
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());  // Enable CORS for all routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", fakeInfoRoutes);

app.listen(process.env.BACKEND_PORT || 5000 , () => {
  console.log("Server is running on port", process.env.BACKEND_PORT);
});
