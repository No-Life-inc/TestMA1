//Helper functions to generate random data for the database
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // `getMonth()` is zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to generate a random street name
const getRandomStreet = () => {
  const streetLength = Math.floor(Math.random() * 10) + 5; // Length between 5 and 14 characters
  return getRandomText(streetLength); // generate random text
};

// Helper function to generate a random number
const getRandomNumber = () => {
  let number = Math.floor(Math.random() * 999) + 1; // number between 1 and 999
  if (Math.random() < 0.2) {
    number += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Add random letter (A-Z)
    return number
  }
  return number.toString();
};

// Helper function to generate a random floor
const getRandomFloor = () => {
  if (Math.random() < 0.3) {
    return "st"; // 30% chance for st (stuen)
  }
  floor = Math.floor(Math.random() * 99) + 1; // Floor number between 1 and 99
  return floor.toString();
};

// Helper function to generate a random door
const getRandomDoor = () => {
  const doorType = Math.floor(Math.random() * 20) + 1;
  if (doorType < 8) {
    return "th";
  } else if (doorType < 15) {
    return "tv";
  } else if (doorType < 17) {
    return "mf";
  } else if (doorType < 19) {
    return Math.floor(Math.random() * 50) + 1; // number between 1 and 50
  } else {
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyzøæå";
    let door =
      lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
    if (Math.random() < 0.5) {
      door += "-";
    }
    door += Math.floor(Math.random() * 999) + 1; // letter + number like "a-123"
    return door;
  }
};

// Helper function to generate random text
const getRandomText = (length = 1) => {
  const validCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZæøåÆØÅ";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += validCharacters.charAt(
      Math.floor(Math.random() * validCharacters.length)
    );
  }
  return text;
};

export {
  formatDate,
  getRandomStreet,
  getRandomNumber,
  getRandomFloor,
  getRandomDoor,
  getRandomText,
};
