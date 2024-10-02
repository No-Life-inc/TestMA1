import express from "express";
import {
  getRandomCPR,
  getRandomPerson,
  getRandomPersonWithBirthdate,
  getRandomPersonWithCPR,
  getRandomPersonWithCPRandBirthdate,
  getRandomAddress,
  getRandomPhoneNumber,
} from "../src/fakeInfoFunctions.js";

const router = express.Router();

router.get("/cpr", (req, res) => {
  try {
    const genderAsBoolean = Math.random() < 0.5;
    const randomCPR = getRandomCPR(genderAsBoolean);
    res.json({ cpr: randomCPR });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to generate random CPR" });
  }
});

router.get("/person", (req, res) => {
  try {
    const person = getRandomPerson();
    res.json(person);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to generate random person" });
  }
});

router.get("/person-dob", (req, res) => {
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

router.get("/person-cpr", (req, res) => {
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

router.get("/person-cpr-dob", (req, res) => {
  try {
    const person = getRandomPersonWithCPRandBirthdate();
    res.json(person);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Failed to generate random person with CPR and birthdate",
    });
  }
});

router.get("/address", async (req, res) => {
  try {
    const address = await getRandomAddress();
    res.json(address);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to generate random address" });
  }
});

router.get("/phone", (req, res) => {
  try {
    const phoneNumber = getRandomPhoneNumber();
    res.json({phoneNumber});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to generate random phone number" });
  }
});

export default router;
