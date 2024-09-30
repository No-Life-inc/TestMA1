import express from "express";
import {
  getRandomCPR,
  getRandomPerson,
  getRandomPersonWithBirthdate,
  getRandomPersonWithCPR,
  getRandomPersonWithCPRandBirthdate,
} from "../src/fakeInfoFunctions.js";

const router = express.Router();

router.get("/random-cpr", (req, res) => {
  try {
    const genderAsBoolean = Math.random() < 0.5;
    const randomCPR = getRandomCPR(genderAsBoolean);
    res.json({ cpr: randomCPR });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to generate random CPR" });
  }
});

router.get("/random-person", (req, res) => {
  try {
    const person = getRandomPerson();
    res.json(person);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to generate random person" });
  }
});

router.get("/random-person-with-birthdate", (req, res) => {
  try {
    const person = getRandomPersonWithBirthdate();
    res.json(person);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Failed to generate random person with birthdate" });
  }
});

router.get("/random-person-with-cpr", (req, res) => {
  try {
    const person = getRandomPersonWithCPR();
    res.json(person);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Failed to generate random person with CPR" });
  }
});

router.get("/random-person-with-cpr-and-birthdate", (req, res) => {
  try {
    const person = getRandomPersonWithCPRandBirthdate();
    res.json(person);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({
        error: "Failed to generate random person with CPR and birthdate",
      });
  }
});


export default router;
