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
} from "../src/fakeInfoFunctions";

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

describe("getRandomPersonPositiveTests", () => {
  test.each([["male"], ["female"]])(
    "should return a person with gender %s",
    (gender) => {
      const mockData = {
        persons: [
          { firstName: "John", lastName: "Doe", gender: "male" },
          { firstName: "Jane", lastName: "Doe", gender: "female" },
        ],
      };
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
      const person = getRandomPerson();
      expect(person).toHaveProperty("firstName");
      expect(person).toHaveProperty("lastName");
      expect(person).toHaveProperty("gender");
      expect(["male", "female"]).toContain(person.gender);
      fs.readFileSync.mockRestore();
    }
  );
});

describe("getRandomPersonWithBirthdatePositiveTests", () => {
  test.each([["male"], ["female"]])(
    "should return a person with gender %s and a valid birthdate",
    (gender) => {
      const person = getRandomPersonWithBirthdate();
      expect(person).toHaveProperty("firstName");
      expect(person).toHaveProperty("lastName");
      expect(person).toHaveProperty("gender");
      expect(person).toHaveProperty("birthDate");
      expect(person.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); // birthDate in yyyy-mm-dd format
    }
  );
});

describe("getRandomPersonWithBirthdateNegativeTests", () => {
  test("should throw an error for invalid birthdate generated from malformed CPR", () => {
    jest.spyOn(global.Math, "random").mockReturnValueOnce(0.999); // Forces an incorrect CPR
    const person = getRandomPersonWithBirthdate();
    const birthDate = new Date(person.birthDate);
    expect(isNaN(birthDate.getTime())).toBe(true); // Date should be invalid
    global.Math.random.mockRestore();
  });
});

describe("getRandomPersonWithCPRPositiveTests", () => {
  test.each([["male"], ["female"]])(
    "should return a person with gender %s and a valid CPR",
    (gender) => {
      const mockData = {
        persons: [
          { firstName: "John", lastName: "Doe", gender: "male" },
          { firstName: "Jane", lastName: "Doe", gender: "female" },
        ],
      };
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
      const person = getRandomPersonWithCPR();
      expect(person).toHaveProperty("firstName");
      expect(person).toHaveProperty("lastName");
      expect(person).toHaveProperty("gender");
      expect(person).toHaveProperty("cpr");
      expect(person.cpr).toMatch(/^\d{10}$/); // CPR skal være 10 cifre
      fs.readFileSync.mockRestore();
    }
  );
});

describe("getRandomPersonWithCPRNegativeTests", () => {
    test("should generate a valid CPR", () => {
      const mockData = {
        persons: [{ firstName: "John", lastName: "Doe", gender: "male" }],
      };
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockData));
  
      const personWithCPR = getRandomPersonWithCPR();
      expect(personWithCPR.cpr).toMatch(/^\d{10}$/); // CPR skal være 10 cifre
  
      fs.readFileSync.mockRestore();
    });
  });

describe("getRandomPersonWithCPRandBirthdatePositiveTests", () => {
  test.each([["male"], ["female"]])(
    "should return a person with gender %s, CPR, and a valid birthdate",
    (gender) => {
      const person = getRandomPersonWithCPRandBirthdate();
      expect(person).toHaveProperty("firstName");
      expect(person).toHaveProperty("lastName");
      expect(person).toHaveProperty("gender");
      expect(person).toHaveProperty("cpr");
      expect(person.cpr).toMatch(/^\d{10}$/); // CPR should be 10 digits
      expect(person).toHaveProperty("birthDate");
      expect(person.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); // birthDate in yyyy-mm-dd format
    }
  );
});

describe("getRandomPersonWithBirthdateNegativeTests", () => {
  test("should throw an error for invalid birthdate generated from malformed CPR", () => {
    jest.spyOn(global.Math, "random").mockReturnValueOnce(0.999); // Forces an invalid day, month, or year
    const person = getRandomPersonWithBirthdate();
    const birthDate = new Date(person.birthDate);
    expect(isNaN(birthDate.getTime())).toBe(true); // Date should be invalid
    global.Math.random.mockRestore();
  });
});
