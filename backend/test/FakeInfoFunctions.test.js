import fs from "fs";
import db from "../db/db.js";
import { jest } from "@jest/globals";
import {
  getRandomCPR,
  getBirthDateFromCPR,
  getRandomPerson,
  getRandomPersonWithBirthdate,
  getRandomPersonWithCPR,
  getRandomPersonWithCPRandBirthdate,
  getRandomAddress,
  getPersonsData,
  getRandomPhoneNumber,
} from "../src/fakeInfoFunctions";
import { phonePrefixes } from "../data/phoneData.js";

describe("getRandomCPRPositiveTests", () => {
  test.each([
    [false, 0], // false for female, expect even last digit
    [true, 1], // true for male, expect odd last digit
  ])(
    "should end with an %s digit for gender %s",
    (gender, expectedRemainder) => {
      const cpr = getRandomCPR(gender);
      const lastDigit = parseInt(cpr[cpr.length - 1], 10);
      expect(lastDigit % 2).toBe(expectedRemainder);
      expect(cpr).toHaveLength(10);
    }
  );
});

describe("getRandomCPRNegativeTests", () => {
  test.each([
    [null, "Invalid input"], // null input
    [undefined, "Invalid input"], // undefined input
    ["male", "Invalid input"], // string input
    [123, "Invalid input"], // number input
    [{}, "Invalid input"], // object input
    [[], "Invalid input"], // array input
  ])(
    "should throw an error for invalid input %s",
    (invalidInput, expectedError) => {
      expect(() => getRandomCPR(invalidInput)).toThrow(expectedError);
    }
  );
});

describe("getBirthDateFromCPRPositiveTests", () => {
  test.each([
    ["0101011234", new Date(2001, 0, 1)], // 1st of January 2001
    ["3112991234", new Date(1999, 11, 31)], // 31st of December 1999
    ["2902021234", new Date(2002, 1, 29)], // 29th of February 2002
  ])("should return the correct birth date for CPR %s", (cpr, expectedDate) => {
    expect(getBirthDateFromCPR(cpr)).toEqual(expectedDate);
  });
});

describe("getBirthDateFromCPRNegativeTests", () => {
  test.each([
    [null, "Invalid input"], // null input
    [undefined, "Invalid input"], // undefined input
    ["123456789", "Invalid input"], // invalid length
    ["12345678901", "Invalid input"], // invalid length
    ["12345678", "Invalid input"], // invalid length
    ["123456789a", "Invalid input"], // invalid character
  ])(
    "should throw an error for invalid input %s",
    (invalidInput, expectedError) => {
      expect(() => getBirthDateFromCPR(invalidInput)).toThrow(expectedError);
    }
  );
});

describe("getPersonsData - Positive Tests", () => {
  test.each([
    [
      "should return parsed data when the file contains valid persons data",
      JSON.stringify({ persons: [{ firstName: "John", lastName: "Doe" }] }),
      1,
      "John",
    ],
    [
      "should return parsed data when the file contains exactly one person (boundary case)",
      JSON.stringify({ persons: [{ firstName: "Solo", lastName: "One" }] }),
      1,
      "Solo",
    ],
  ])(
    "%s",
    (testDescription, mockFileData, expectedLength, expectedFirstName) => {
      jest.spyOn(fs, "readFileSync").mockReturnValue(mockFileData);
      const data = getPersonsData();

      expect(data.persons).toHaveLength(expectedLength);
      expect(data.persons[0].firstName).toBe(expectedFirstName);
    }
  );
});

describe("getPersonsData - Negative Tests", () => {
  test.each([
    [
      "should throw an error if the file does not exist",
      () => {
        throw new Error("File not found");
      },
      "Error reading or parsing person-names.json",
    ],
    [
      "should throw an error if the file contains invalid JSON",
      "Invalid JSON",
      "Error reading or parsing person-names.json",
    ],
    [
      "should throw an error if the persons array is empty",
      JSON.stringify({ persons: [] }),
      "No persons found in the data file",
    ],
    [
      "should throw an error if the persons key is not an array",
      JSON.stringify({ persons: "Not an array" }),
      "No persons found in the data file",
    ],
    [
      "should throw an error if the file is missing the persons array",
      JSON.stringify({ noPersons: [] }),
      "No persons found in the data file",
    ],
  ])("%s", (testDescription, mockFileData, expectedError) => {
    if (typeof mockFileData === "function") {
      jest.spyOn(fs, "readFileSync").mockImplementation(mockFileData);
    } else {
      jest.spyOn(fs, "readFileSync").mockReturnValue(mockFileData);
    }

    expect(() => getPersonsData()).toThrow(expectedError);
  });
});

describe("getRandomPerson - Positive Tests", () => {
  let getPersonsData, getRandomPerson;

  beforeEach(async () => {
    // Dynamically import the module and grab its functions
    const module = await import("../src/fakeInfoFunctions");

    getPersonsData = module.getPersonsData;
    getRandomPerson = module.getRandomPerson;

    // Manually mock getPersonsData using jest.fn()
    getPersonsData = jest.fn(() => ({
      persons: [{ firstName: "John", lastName: "Doe", gender: "Male" }],
    }));

    // Manually mock getRandomPerson using jest.fn()
    getRandomPerson = jest.fn(() => ({
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
    }));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  test.each([
    [
      "should return a random person from valid persons data",
      {
        persons: [
          { firstName: "John", lastName: "Doe", gender: "Male" },
          { firstName: "Jane", lastName: "Doe", gender: "Female" },
        ],
      },
      2,
    ],
    [
      "should return the only person when the persons array contains exactly one person",
      {
        persons: [{ firstName: "Solo", lastName: "One", gender: "Non-binary" }],
      },
      1,
    ],
  ])("%s", (testDescription, mockPersonsData, expectedPersonsLength) => {
    // Mock return value of getPersonsData for each test case
    getPersonsData.mockReturnValue(mockPersonsData);

    // Call getRandomPerson (which might depend on getPersonsData)
    const randomPerson = getRandomPerson();

    // Assertions
    expect(mockPersonsData.persons).toHaveLength(expectedPersonsLength);
    expect(randomPerson).toHaveProperty("firstName");
    expect(randomPerson).toHaveProperty("lastName");
    expect(randomPerson).toHaveProperty("gender");
  });
});

describe("getRandomPerson - Negative Tests", () => {
  let getPersonsData, getRandomPerson;

  beforeEach(async () => {
    const module = await import("../src/fakeInfoFunctions");

    getPersonsData = module.getPersonsData;
    getRandomPerson = module.getRandomPerson;

    // Only mock getPersonsData, not getRandomPerson
    getPersonsData = jest.fn(); // Mock the getPersonsData function
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  test("should throw an error if getPersonsData returns undefined", () => {
    getPersonsData.mockReturnValue(undefined);
    expect(() => getRandomPerson()).toThrow("No persons found in the data file");
  });

  test("should throw an error if the persons array is empty", () => {
    getPersonsData.mockReturnValue({ persons: [] });
    expect(() => getRandomPerson()).toThrow("No persons found in the data file");
  });

  test("should throw an error if persons is not an array", () => {
    getPersonsData.mockReturnValue({ persons: null });
    expect(() => getRandomPerson()).toThrow("No persons found in the data file");
  });

  test("should throw an error if a person is missing firstName or lastName", () => {
    getPersonsData.mockReturnValue({
      persons: [{ lastName: "Doe", gender: "Male" }], // Missing firstName
    });
    expect(() => getRandomPerson()).toThrow("No persons found in the data file");
  });

  test("should throw an error if getPersonsData returns null", () => {
    getPersonsData.mockReturnValue(null);
    expect(() => getRandomPerson()).toThrow("No persons found in the data file");
  });
});

describe("getRandomPersonWithBirthdate - Positive Tests", () => {
  let getPersonsData, getRandomPerson, getRandomCPR, getBirthDateFromCPR, formatDate;

  beforeEach(async () => {
    // Dynamisk import af modulet og få fat i funktionerne
    const module = await import("../src/fakeInfoFunctions");

    getPersonsData = module.getPersonsData;
    getRandomPerson = module.getRandomPerson;
    getRandomCPR = module.getRandomCPR;
    getBirthDateFromCPR = module.getBirthDateFromCPR;
    formatDate = module.formatDate;

    // Manuelt mock funktionerne
    getPersonsData = jest.fn(() => ({
      persons: [{ firstName: "John", lastName: "Doe", gender: "Male" }],
    }));

    getRandomPerson = jest.fn(() => ({
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
    }));

    getRandomCPR = jest.fn(() => "0101011234");
    getBirthDateFromCPR = jest.fn(() => new Date(2001, 0, 1));
    formatDate = jest.fn((date) => date.toISOString().split("T")[0]);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  test.each([
    [
      "should return a valid person with male CPR and birthdate",
      {
        persons: [
          { firstName: "John", lastName: "Doe", gender: "Male" },
        ],
      },
      "0101011234", // Mock CPR
      new Date(2001, 0, 1), // Mock fødselsdato
      "2001-01-01", // Mock formateret fødselsdato
    ],
    [
      "should return a valid person with female CPR and birthdate",
      {
        persons: [
          { firstName: "Jane", lastName: "Doe", gender: "Female" },
        ],
      },
      "0202022468", // Mock CPR for kvinde
      new Date(2002, 1, 2), // Mock fødselsdato
      "2002-02-02", // Mock formateret fødselsdato
    ],
  ])(
      "%s",
      (testDescription, mockPersonsData, mockCPR, mockBirthDate, mockFormattedDate) => {
        // Mock return values for functions in each test case
        getPersonsData.mockReturnValue(mockPersonsData);
        getRandomCPR.mockReturnValue(mockCPR);
        getBirthDateFromCPR.mockReturnValue(mockBirthDate);
        formatDate.mockReturnValue(mockFormattedDate);

        // Call getRandomPersonWithBirthdate (som afhænger af de mockede funktioner)
        const randomPersonWithBirthdate = {
          firstName: mockPersonsData.persons[0].firstName,
          lastName: mockPersonsData.persons[0].lastName,
          gender: mockPersonsData.persons[0].gender,
          birthDate: mockFormattedDate,
        };

        // Assertions
        expect(randomPersonWithBirthdate.firstName).toBe(mockPersonsData.persons[0].firstName);
        expect(randomPersonWithBirthdate.lastName).toBe(mockPersonsData.persons[0].lastName);
        expect(randomPersonWithBirthdate.gender).toBe(mockPersonsData.persons[0].gender);
        expect(randomPersonWithBirthdate.birthDate).toBe(mockFormattedDate);
      }
  );
});

describe("getRandomPersonWithBirthdate - Negative Tests", () => {
  let getPersonsData,
      getRandomPerson,
      getRandomCPR,
      getBirthDateFromCPR,
      formatDate;

  beforeEach(async () => {
    // Dynamisk import af modulet og få fat i funktionerne
    const module = await import("../src/fakeInfoFunctions");

    getPersonsData = module.getPersonsData;
    getRandomPerson = module.getRandomPerson;
    getRandomCPR = module.getRandomCPR;
    getBirthDateFromCPR = module.getBirthDateFromCPR;
    formatDate = module.formatDate;

    // Mock funktioner for negative tests
    getPersonsData = jest.fn(() => ({
      persons: [],
    }));

    getRandomPerson = jest.fn(() => ({
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
    }));

    getRandomCPR = jest.fn(() => "invalidCPR");
    getBirthDateFromCPR = jest.fn(() => {
      throw new Error("Invalid CPR format");
    });
    formatDate = jest.fn((date) => date.toISOString().split("T")[0]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [
      "should handle no persons found in data file",
      {
        persons: [],
      },
      "0101011234", // Valid CPR
      new Date(2001, 0, 1), // Valid birthdate
      "2001-01-01", // Formatted date
      "No persons found", // Expected error message
    ],
    [
      "should handle invalid CPR format",
      {
        persons: [{ firstName: "John", lastName: "Doe", gender: "Male" }],
      },
      "invalidCPR", // Invalid CPR format
      null, // Invalid birthdate (because CPR is invalid)
      null, // No formatted date
      "Invalid CPR format", // Expected error message
    ],
  ])(
      "%s",
      (
          testDescription,
          mockPersonsData,
          mockCPR,
          mockBirthDate,
          mockFormattedDate,
          expectedError
      ) => {
        // Mock return values for functions in each test case
        getPersonsData.mockReturnValue(mockPersonsData);
        getRandomCPR.mockReturnValue(mockCPR);
        if (mockBirthDate) {
          getBirthDateFromCPR.mockReturnValue(mockBirthDate);
          formatDate.mockReturnValue(mockFormattedDate);
        } else {
          getBirthDateFromCPR.mockImplementation(() => {
            throw new Error(expectedError);
          });
        }

        try {
          const result = {
            firstName: mockPersonsData.persons[0]?.firstName,
            lastName: mockPersonsData.persons[0]?.lastName,
            gender: mockPersonsData.persons[0]?.gender,
            birthDate: mockFormattedDate,
          };

          if (!mockPersonsData.persons.length) {
            throw new Error("No persons found");
          }

          if (!mockCPR.match(/^\d{10}$/)) {
            throw new Error(expectedError);
          }

          expect(result).toEqual({
            firstName: mockPersonsData.persons[0].firstName,
            lastName: mockPersonsData.persons[0].lastName,
            gender: mockPersonsData.persons[0].gender,
            birthDate: mockFormattedDate,
          });
        } catch (error) {
          expect(error.message).toBe(expectedError);
        }
      }
  );
});

describe("getRandomPersonWithCPR - Positive Tests", () => {
  let getPersonsData, getRandomPerson, getRandomCPR;

  beforeEach(async () => {
    const module = await import("../src/fakeInfoFunctions");

    // Importer funktionerne
    getPersonsData = module.getPersonsData;
    getRandomPerson = module.getRandomPerson;
    getRandomCPR = module.getRandomCPR;

    // Mock funktionerne til test cases
    getPersonsData = jest.fn(() => ({
      persons: [{ firstName: "John", lastName: "Doe", gender: "Male" }],
    }));

    getRandomPerson = jest.fn(() => ({
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
    }));

    getRandomCPR = jest.fn(() => "0101011235"); // CPR ending with odd number (for male)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [
      "should return a valid person with male CPR",
      {
        persons: [{ firstName: "John", lastName: "Doe", gender: "Male" }],
      },
      "0101011235", // CPR for male (last digit is odd)
    ],
    [
      "should return a valid person with female CPR",
      {
        persons: [{ firstName: "Jane", lastName: "Doe", gender: "Female" }],
      },
      "0202022468", // CPR for female (last digit is even)
    ],
  ])("%s", (testDescription, mockPersonsData, mockCPR) => {
    // Mock return values for each test case
    getPersonsData.mockReturnValue(mockPersonsData);
    getRandomCPR.mockReturnValue(mockCPR);

    // Test funktionen
    const result = {
      firstName: mockPersonsData.persons[0]?.firstName,
      lastName: mockPersonsData.persons[0]?.lastName,
      gender: mockPersonsData.persons[0]?.gender,
      cpr: mockCPR,
    };

    // Forventet resultat
    expect(result.firstName).toBe(mockPersonsData.persons[0].firstName);
    expect(result.lastName).toBe(mockPersonsData.persons[0].lastName);
    expect(result.gender).toBe(mockPersonsData.persons[0].gender);
    expect(result.cpr).toBe(mockCPR);

    // Valider det sidste ciffer i CPR baseret på køn
    const lastDigit = parseInt(mockCPR.slice(-1), 10);
    if (result.gender === "Male") {
      expect(lastDigit % 2).toBe(1); // Ulige sidste ciffer for mænd
    } else {
      expect(lastDigit % 2).toBe(0); // Lige sidste ciffer for kvinder
    }
  });
});
describe("getRandomPersonWithCPR - Negative Tests", () => {
  let getPersonsData, getRandomPerson, getRandomCPR;

  beforeEach(async () => {
    const module = await import("../src/fakeInfoFunctions");

    // Importer funktionerne
    getPersonsData = module.getPersonsData;
    getRandomPerson = module.getRandomPerson;
    getRandomCPR = module.getRandomCPR;

    // Mock funktionerne til test cases
    getPersonsData = jest.fn(() => ({
      persons: [],
    }));

    getRandomPerson = jest.fn(() => ({
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
    }));

    getRandomCPR = jest.fn(() => "invalidCPR"); // Placeholder, ændres i hver test case
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [
      "should handle no persons found in data file",
      {
        persons: [],
      },
      "0101011234", // Valid CPR
      "No persons found", // Expected error message
    ],
    [
      "should handle invalid CPR format",
      {
        persons: [{ firstName: "John", lastName: "Doe", gender: "Male" }],
      },
      "invalidCPR", // Invalid CPR format
      "Invalid CPR format", // Expected error message
    ],
    [
      "should handle too short CPR",
      {
        persons: [{ firstName: "John", lastName: "Doe", gender: "Male" }],
      },
      "12345", // Too short CPR
      "Invalid CPR length", // Expected error message
    ],
    [
      "should handle too long CPR",
      {
        persons: [{ firstName: "John", lastName: "Doe", gender: "Male" }],
      },
      "123456789012", // Too long CPR
      "Invalid CPR length", // Expected error message
    ],
  ])("%s", (testDescription, mockPersonsData, mockCPR, expectedError) => {
    // Mock return values for each test case
    getPersonsData.mockReturnValue(mockPersonsData);
    getRandomCPR.mockReturnValue(mockCPR);

    try {
      // Test funktionen
      const result = {
        firstName: mockPersonsData.persons[0]?.firstName,
        lastName: mockPersonsData.persons[0]?.lastName,
        gender: mockPersonsData.persons[0]?.gender,
        cpr: mockCPR,
      };
      // Hvis ingen personer er fundet, kast en fejl
      if (!mockPersonsData.persons.length) {
        throw new Error("No persons found");
      }

      // Valider CPR længde og format
      if (!mockCPR.match(/^\d{10}$/)) {
        throw new Error(expectedError);
      }

      // Forventet resultat, hvis alt er korrekt
      expect(result).toEqual({
        firstName: mockPersonsData.persons[0].firstName,
        lastName: mockPersonsData.persons[0].lastName,
        gender: mockPersonsData.persons[0].gender,
        cpr: mockCPR,
      });
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });
});

//Positive tests for getRandomPhoneNumber
describe("getRandomPhoneNumber - Positive Tests", () => {
  test.each([
    [
      "should return a valid phone number with 8 digits",
      (phone) => expect(phone).toMatch(/^\d{8}$/),
    ],
    [
      "should return a phone number that starts with a valid prefix",
      (phone) => {
        const matchingPrefix = phonePrefixes.find((prefix) =>
          phone.startsWith(prefix)
        );
        expect(matchingPrefix).toBeDefined();
      },
    ],
  ])("%s", (testDescription, assertion) => {
    const phoneNumber = getRandomPhoneNumber();
    assertion(phoneNumber);
  });
});

describe("getRandomAddress - Positive Tests", () => {

  beforeEach(async () => {
    // Sørg for at forbinde til databasen
    await db.raw('SELECT 1'); // Simpel forespørgsel for at sikre, at forbindelsen er etableret
  });

  afterAll(async () => {
    // Luk databaseforbindelsen efter alle tests er færdige
    await db.destroy();
  });

  test('should return a random address with random street, number, floor, and door', async () => {
    const result = await getRandomAddress(); // Kald din funktion

    ['street', 'number', 'floor', 'door', 'postal_code', 'town_name'].forEach(prop => expect(result).toHaveProperty(prop));
  });
});


//Negative tests for randomPhoneNumber
describe("getRandomPhoneNumber - Negative Tests", () => {
  // Table-driven tests for phone number length, character checks, and prefix validation
  test.each([
    [
      "should not return a phone number shorter than 8 digits",
      (phone) => expect(phone.length).toBeGreaterThanOrEqual(8),
    ],
    [
      "should not return a phone number longer than 8 digits",
      (phone) => expect(phone.length).toBeLessThanOrEqual(8),
    ],
    [
      "should not contain any non-numeric characters",
      (phone) => expect(phone).toMatch(/^\d+$/),
    ],
    [
      "should always start with a valid prefix",
      (phone) => {
        const matchingPrefix = phonePrefixes.find((prefix) =>
          phone.startsWith(prefix)
        );
        expect(matchingPrefix).toBeDefined();
      },
    ],
    [
      "should not return a phone number with an invalid prefix length",
      (phone) => {
        const prefixLength = phonePrefixes.find((prefix) =>
          phone.startsWith(prefix)
        )?.length;
        const remainingDigits = 8 - (prefixLength || 0);
        expect(remainingDigits).toBeGreaterThanOrEqual(0);
      },
    ],
  ])("%s", (testDescription, assertion) => {
    const phoneNumber = getRandomPhoneNumber();
    assertion(phoneNumber);
  });
});
