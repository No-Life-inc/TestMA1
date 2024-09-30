import express from "express";
import dotenv from "dotenv";
import {
  getRandomPerson,
  getRandomPersonWithBirthdate,
  getRandomPersonWithCPR,
} from "./src/fakeInfoFunctions.js";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/random-person", (req, res) => {
  const person = getRandomPerson();
  res.json(person);
});

app.get("/random-person-with-birthdate", (req, res) => {
  const person = getRandomPersonWithBirthdate();
  res.json(person);
});

app.get("/random-person-with-cpr", (req, res) => {
  const person = getRandomPersonWithCPR();
  res.json(person);
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log("Server is running on port", process.env.BACKEND_PORT);
});
