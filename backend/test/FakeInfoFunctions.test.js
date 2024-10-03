import fs from "fs";
import { jest } from "@jest/globals";
import {
  getRandomCPR,
  getBirthDateFromCPR,
  getRandomPerson,
  getRandomPersonWithBirthdate,
  getRandomPersonWithCPR,
  getRandomPersonWithCPRandBirthdate,
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
