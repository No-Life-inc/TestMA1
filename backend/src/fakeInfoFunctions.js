
// make a CPR number function
const getRandomCPR = (gender) => {

    if (typeof gender !== 'boolean') {
        throw new Error('Invalid input');
    }

    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // 01 to 28
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'); // 01 to 12
    const year = String(Math.floor(Math.random() * 100)).padStart(2, '0'); // 00 to 99

    let cpr = day + month + year;

    // Generate the next 3 random digits
    for (let i = 0; i < 3; i++) {
        cpr += Math.floor(Math.random() * 10).toString();
    }

    let lastDigit;
    if (gender) { // Assuming true for male
        lastDigit = Math.floor(Math.random() * 5) * 2 + 1; // Generates an odd number
    } else { // Assuming false for female
        lastDigit = Math.floor(Math.random() * 5) * 2; // Generates an even number
    }

    cpr += lastDigit.toString();
    return cpr;
};

const getBirthDateFromCPR = (cpr) => {

    if (cpr === null || cpr === undefined || typeof cpr !== 'string' || cpr.length !== 10 || !/^\d+$/.test(cpr)) {
        throw new Error('Invalid input');
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
}

module.exports = {
    getRandomCPR,
    getBirthDateFromCPR
};