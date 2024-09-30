import express from "express";
import dotenv from "dotenv";
import { getRandomPerson } from "./src/fakeInfoFunctions.js";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/random-person", (req, res) => {
  const person = getRandomPerson();
  res.json(person);
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log("Server is running on port", process.env.BACKEND_PORT);
});
