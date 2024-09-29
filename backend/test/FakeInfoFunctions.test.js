import { getRandomCPR, getBirthDateFromCPR } from '../src/fakeInfoFunctions';

describe('getRandomCPRPositiveTests', () => {
    test.each([
        [false, 0], // false for female, expect even last digit
        [true, 1]   // true for male, expect odd last digit
    ])('should end with an %s digit for gender %s', (gender, expectedRemainder) => {
        const cpr = getRandomCPR(gender);
        const lastDigit = parseInt(cpr[cpr.length - 1], 10);
        expect(lastDigit % 2).toBe(expectedRemainder);
    });
});

describe('getRandomCPRNegativeTests', () => {
    test.each([
        [null, 'Invalid input'], // null input
        [undefined, 'Invalid input'], // undefined input
        ['male', 'Invalid input'], // string input
        [123, 'Invalid input'], // number input
        [{}, 'Invalid input'], // object input
        [[], 'Invalid input'] // array input
    ])('should throw an error for invalid input %s', (invalidInput, expectedError) => {
        expect(() => getRandomCPR(invalidInput)).toThrow(expectedError);
    });
});

describe('getBirthDateFromCPRPositiveTests', () => {
    test.each([
        ['0101011234', new Date(2001, 0, 1)], // 1st of January 2001
        ['3112991234', new Date(1999, 11, 31)], // 31st of December 1999
        ['2902021234', new Date(2002, 1, 29)] // 29th of February 2002
    ])('should return the correct birth date for CPR %s', (cpr, expectedDate) => {
        expect(getBirthDateFromCPR(cpr)).toEqual(expectedDate);
    });
});

describe('getBirthDateFromCPRNegativeTests', () => {
    test.each([
        [null, 'Invalid input'], // null input
        [undefined, 'Invalid input'], // undefined input
        ['123456789', 'Invalid input'], // invalid length
        ['12345678901', 'Invalid input'], // invalid length
        ['12345678', 'Invalid input'], // invalid length
        ['123456789a', 'Invalid input'], // invalid character
    ])('should throw an error for invalid input %s', (invalidInput, expectedError) => {
        expect(() => getBirthDateFromCPR(invalidInput)).toThrow(expectedError);
    });
});