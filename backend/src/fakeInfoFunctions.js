import fs from "fs";
import path from "path";
import db from "../db/db.js";
import {
  formatDate,
  getRandomStreet,
  getRandomNumber,
  getRandomFloor,
  getRandomDoor,
} from "./helperFunctions.js";
import { phonePrefixes } from "../data/phoneData.js";

// make a CPR number function
const getRandomCPR = (gender) => {
  if (typeof gender !== "boolean") {
    throw new Error("Invalid input");
  }

  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0"); // 01 to 28
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0"); // 01 to 12
  const year = String(Math.floor(Math.random() * 100)).padStart(2, "0"); // 00 to 99

  let cpr = day + month + year;

  // Generate the next 3 random digits
  for (let i = 0; i < 3; i++) {
    cpr += Math.floor(Math.random() * 10).toString();
  }

  let lastDigit;
  if (gender) {
    // Assuming true for male
    lastDigit = Math.floor(Math.random() * 5) * 2 + 1; // Generates an odd number
  } else {
    // Assuming false for female
    lastDigit = Math.floor(Math.random() * 5) * 2; // Generates an even number
  }

  cpr += lastDigit.toString();
  return cpr;
};

const getBirthDateFromCPR = (cpr) => {
  if (
    cpr === null ||
    cpr === undefined ||
    typeof cpr !== "string" ||
    cpr.length !== 10 ||
    !/^\d+$/.test(cpr)
  ) {
    throw new Error("Invalid input");
  }

  const day = parseInt(cpr.substr(0, 2), 10);
  const month = parseInt(cpr.substr(2, 2), 10);
  const year = parseInt(cpr.substr(4, 2), 10);

  // Adjust the year to the correct century

  let fullYear;
  if (year < 50) {
    fullYear = 2000 + year;
  } else {
    fullYear = 1900 + year;
  }

  return new Date(fullYear, month - 1, day);
};

//Bruges til at indlæse json filen
const getPersonsData = () => {
  try {
    const filePath = path.resolve("data", "person-names.json");
    const data = fs.readFileSync(filePath, "utf-8");

    const parsedData = JSON.parse(data);

    if (
      !parsedData ||
      !Array.isArray(parsedData.persons) ||
      parsedData.persons.length === 0
    ) {
      throw new Error("No persons found in the data file");
    }

    return parsedData;
  } catch (error) {
    throw new Error("Error reading or parsing person-names.json");
  }
};

// Funktion der henter en tilfældig person fra json filen
const getRandomPerson = () => {
  const personsData = getPersonsData();

  if (!personsData) {
    throw new Error("Unable to load data from person-names.json");
  }

  const persons = personsData.persons;

  if (persons.length === 0) {
    throw new Error("No persons available in the data file");
  }

  const randomIndex = Math.floor(Math.random() * persons.length);
  const randomPerson = persons[randomIndex];

  return {
    firstName: randomPerson.firstName,
    lastName: randomPerson.lastName,
    gender: randomPerson.gender,
  };
};

// Funktion der henter en tilfældig person fra json filen og tilføjer en birthdate
const getRandomPersonWithBirthdate = () => {
  const randomPerson = getRandomPerson();

  const genderAsBoolean = randomPerson.gender === "male";

  const randomCPR = getRandomCPR(genderAsBoolean); //Laver et random cpr ud fra kønnet

  const birthDate = getBirthDateFromCPR(randomCPR); //Laver en birthdate ud fra cpr

  return {
    firstName: randomPerson.firstName,
    lastName: randomPerson.lastName,
    gender: randomPerson.gender,
    birthDate: formatDate(birthDate),
  };
};

// Funktion der henter en tilfældig person fra json filen og tilføjer en cpr
const getRandomPersonWithCPR = () => {
  const randomPerson = getRandomPerson();

  const genderAsBoolean = randomPerson.gender === "male";
  const randomCPR = getRandomCPR(genderAsBoolean);

  return {
    firstName: randomPerson.firstName,
    lastName: randomPerson.lastName,
    gender: randomPerson.gender,
    cpr: randomCPR,
  };
};

// Funktion der henter en tilfældig person fra json filen og tilføjer en cpr og birthdate
const getRandomPersonWithCPRandBirthdate = (
  randomPersonGenerator = getRandomPerson,
  randomCPRGenerator = getRandomCPR
) => {
  const randomPerson = randomPersonGenerator();

  const genderAsBoolean = randomPerson.gender === "male";
  const randomCPR = randomCPRGenerator(genderAsBoolean);
  const birthDate = getBirthDateFromCPR(randomCPR);

  return {
    firstName: randomPerson.firstName,
    lastName: randomPerson.lastName,
    gender: randomPerson.gender,
    cpr: randomCPR,
    birthDate: formatDate(birthDate),
  };
};

// Funktion til at hente en tilfældig adresse fra databasen
const getRandomAddress = async () => {
  try {
    const address = await db("address").orderByRaw("RAND()").first();
    const street = getRandomStreet();
    const number = getRandomNumber();
    const floor = getRandomFloor();
    const door = getRandomDoor();

    return {
      street,
      number,
      floor,
      door,
      postal_code: address.postal_code,
      town_name: address.town_name,
    };
  } catch (error) {
    console.error("Error fetching random address:", error.message);
    throw new Error("Failed to fetch random address");
  }
};

const getRandomPhoneNumber = () => {
  const prefix =
    phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
  let phoneNumber = prefix;
  const remainingDigits = 8 - prefix.length;

  for (let i = 0; i < remainingDigits; i++) {
    phoneNumber += Math.floor(Math.random() * 10).toString();
  }
  return phoneNumber;
};

const getRandomPersonFullInfo = async () => {
  const personInfo = getRandomPersonWithCPRandBirthdate();
  const address = await getRandomAddress();
  const phoneNumber = getRandomPhoneNumber();

  return {
    firstName: personInfo.firstName,
    lastName: personInfo.lastName,
    gender: personInfo.gender,
    birthDate: personInfo.birthDate,
    cpr: personInfo.cpr,
    address,
    phoneNumber,
  };
};

const getRandomPersonsBulk = async (count) => {
  if (count < 2) count = 2;
  if (count > 100) count = 100;

  const persons = [];
  for (let i = 0; i < count; i++) {
    const fullPersonInfo = await getRandomPersonFullInfo();
    persons.push(fullPersonInfo);
  }
  return persons;
};

export {
  getRandomCPR,
  getBirthDateFromCPR,
  getRandomPerson,
  getRandomPersonWithBirthdate,
  getRandomPersonWithCPR,
  getRandomPersonWithCPRandBirthdate,
  getPersonsData,
  getRandomAddress,
  getRandomPhoneNumber,
  getRandomPersonFullInfo,
  getRandomPersonsBulk,
};
