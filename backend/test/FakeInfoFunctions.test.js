import fs from "fs";
import jest from "jest-mock";
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

describe("getPersonsDataPositiveTests", () => {
  test("should return valid persons data when the file is available", () => {
    const mockData = {
      persons: [{ firstName: "John", lastName: "Doe", gender: "male" }],
    };
    jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
    const data = getPersonsData();
    expect(data).toEqual(mockData);
    fs.readFileSync.mockRestore(); // Restore the mock after test
  });
});

describe("getPersonsDataNegativeTests", () => {
  test("should throw an error when no persons are found", () => {
    const mockData = { persons: [] };
    jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));

    expect(() => getPersonsData()).toThrow(
      "Error reading or parsing person-names.json"
    );
    fs.readFileSync.mockRestore(); // Gendan original funktionalitet
  });
  test("should throw an error when file cannot be read", () => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("Error reading or parsing person-names.json");
    });
    expect(() => getPersonsData()).toThrow(
      "Error reading or parsing person-names.json"
    );
    fs.readFileSync.mockRestore();
  });
});

// Boundary Analysis: Handle case with exactly one person
describe("getPersonsDataBoundaryTests", () => {
  test("should return data for exactly one person in file", () => {
    const mockData = {
      persons: [{ firstName: "John", lastName: "Doe", gender: "male" }],
    };
    jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
    const data = getPersonsData();
    expect(data.persons).toHaveLength(1); // Boundary: Exactly one person
    fs.readFileSync.mockRestore();
  });
});

// Boundary Analysis: Test with file containing only one male or one female
describe("getRandomPersonBoundaryTests", () => {
  test.each([["male"], ["female"]])(
    "should return the only person available in file with gender %s",
    (gender) => {
      const mockData = {
        persons: [{ firstName: "Unique", lastName: "Person", gender }],
      };
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
      const person = getRandomPerson();
      expect(person.firstName).toBe("Unique"); // Boundary: Only one person in the file
      expect(person.gender).toBe(gender);
      fs.readFileSync.mockRestore();
    }
  );
});

describe("getRandomPersonNegativeTests", () => {
  test("Returns the first person when random index is 0", () => {
    const mockGetPersonsData = jest
      .spyOn(global, "getPersonsData")
      .mockReturnValue({
        persons: [
          { firstName: "John", lastName: "Doe", gender: "male" },
          { firstName: "Jane", lastName: "Doe", gender: "female" },
        ],
      });

    jest.spyOn(Math, "random").mockReturnValue(0); // Mock til at returnere første person

    const person = getRandomPerson();

    expect(person).toEqual({
      firstName: "John",
      lastName: "Doe",
      gender: "male",
    });

    mockGetPersonsData.mockRestore();
    Math.random.mockRestore();
  });
});

// //TODO - alle test herfra og ned skal muligvis ændres, så de følger boundary analysis og equivalence partitioning bedre
// describe("getRandomPersonPositiveTests", () => {
//   test.each([["male"], ["female"]])(
//     "should return a person with gender %s",
//     (gender) => {
//       const mockData = {
//         persons: [
//           { firstName: "John", lastName: "Doe", gender: "male" },
//           { firstName: "Jane", lastName: "Doe", gender: "female" },
//         ],
//       };
//       jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
//       const person = getRandomPerson();
//       expect(person).toHaveProperty("firstName");
//       expect(person).toHaveProperty("lastName");
//       expect(person).toHaveProperty("gender");
//       expect(["male", "female"]).toContain(person.gender);
//       fs.readFileSync.mockRestore();
//     }
//   );
// });
//
// describe("getRandomPersonWithBirthdatePositiveTests", () => {
//   test.each([["male"], ["female"]])(
//     "should return a person with gender %s and a valid birthdate",
//     (gender) => {
//       const person = getRandomPersonWithBirthdate();
//       expect(person).toHaveProperty("firstName");
//       expect(person).toHaveProperty("lastName");
//       expect(person).toHaveProperty("gender");
//       expect(person).toHaveProperty("birthDate");
//       expect(person.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); // birthDate in yyyy-mm-dd format
//     }
//   );
// });
//
// //TODO - Negative test skal fikses
// // describe("getRandomPersonWithBirthdateNegativeTests", () => {
// //   test("should throw an error for invalid birthdate generated from malformed CPR", () => {
// //     // Brug jest.spyOn til at mocke getRandomCPR
// //     const spy = jest.spyOn({ getRandomCPR }, 'getRandomCPR').mockReturnValueOnce("9999999999"); // Ugyldigt CPR
//
// //     const person = getRandomPersonWithBirthdate();
// //     const birthDate = new Date(person.birthDate);
//
// //     // Kontrollér, at den genererede fødselsdato er ugyldig
// //     expect(isNaN(birthDate.getTime())).toBe(true); // Date should be invalid
//
// //     spy.mockRestore(); // Gendan den oprindelige adfærd
// //   });
// // });
//
// describe("getRandomPersonWithCPRPositiveTests", () => {
//   test.each([["male"], ["female"]])(
//     "should return a person with gender %s and a valid CPR",
//     (gender) => {
//       const mockData = {
//         persons: [
//           { firstName: "John", lastName: "Doe", gender: "male" },
//           { firstName: "Jane", lastName: "Doe", gender: "female" },
//         ],
//       };
//       jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
//       const person = getRandomPersonWithCPR();
//       expect(person).toHaveProperty("firstName");
//       expect(person).toHaveProperty("lastName");
//       expect(person).toHaveProperty("gender");
//       expect(person).toHaveProperty("cpr");
//       expect(person.cpr).toMatch(/^\d{10}$/); // CPR skal være 10 cifre
//       fs.readFileSync.mockRestore();
//     }
//   );
// });
//
// describe("getRandomPersonWithCPRNegativeTests", () => {
//     test("should generate a valid CPR", () => {
//       const mockData = {
//         persons: [{ firstName: "John", lastName: "Doe", gender: "male" }],
//       };
//       jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
//
//       const personWithCPR = getRandomPersonWithCPR();
//       expect(personWithCPR.cpr).toMatch(/^\d{10}$/); // CPR skal være 10 cifre
//
//       fs.readFileSync.mockRestore();
//     });
//   });
//
// describe("getRandomPersonWithCPRandBirthdatePositiveTests", () => {
//   test.each([["male"], ["female"]])(
//     "should return a person with gender %s, CPR, and a valid birthdate",
//     (gender) => {
//       const person = getRandomPersonWithCPRandBirthdate();
//       expect(person).toHaveProperty("firstName");
//       expect(person).toHaveProperty("lastName");
//       expect(person).toHaveProperty("gender");
//       expect(person).toHaveProperty("cpr");
//       expect(person.cpr).toMatch(/^\d{10}$/); // CPR should be 10 digits
//       expect(person).toHaveProperty("birthDate");
//       expect(person.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); // birthDate in yyyy-mm-dd format
//     }
//   );
// });

//Positive tests for getRandomPhoneNumber
describe("getRandomPhoneNumber", () => {
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
