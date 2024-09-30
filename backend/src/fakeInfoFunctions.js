import fs from "fs";
import path from "path";

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
    console.error(
      "Error reading or parsing person-names.json: ",
      error.message
    );
    return null;
  }
};

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

const getRandomPersonWithBirthdate = () => {
  const randomPerson = getRandomPerson();

  const genderAsBoolean = randomPerson.gender === "male";

  const randomCPR = getRandomCPR(genderAsBoolean); //Laver et random cpr ud fra kønnet

  const birthDate = getBirthDateFromCPR(randomCPR); //Laver en birthdate ud fra cpr

  return {
    firstName: randomPerson.firstName,
    lastName: randomPerson.lastName,
    gender: randomPerson.gender,
    birthDate: birthDate.toISOString().split("T")[0], //ISO format, så det hedder yyyy-mm-dd
  };
};

export { getRandomCPR, getBirthDateFromCPR, getRandomPerson, getRandomPersonWithBirthdate };
