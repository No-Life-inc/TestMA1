//Hjælper funktion til konvertering af Date objektet til en string
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // `getMonth()` er 0-baseret
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Hjælper funktion til at generere et tilfældigt gadenavn
const getRandomStreet = () => {
  const streetLength = Math.floor(Math.random() * 10) + 5; // Længde på gadenavn
  return getRandomText(streetLength); // Genér tilfældigt navn
};

// Hjælper funktion til at generere et tilfældigt husnummer
const getRandomNumber = () => {
  let number = Math.floor(Math.random() * 999) + 1; // Tal mellem 1 og 999
  if (Math.random() < 0.2) {
    number += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Tilsæt tilfældigt bogstav (A-Z) 20% af gangene
  }
  return number;
};

// Hjælper funktion til at generere en tilfældig etage
const getRandomFloor = () => {
  if (Math.random() < 0.3) {
    return "st"; // 30% sandsynlighed for stue
  }
  return Math.floor(Math.random() * 99) + 1; // Etage fra 1 til 99
};

// Hjælper funktion til at generere en tilfældig dør
const getRandomDoor = () => {
  const doorType = Math.floor(Math.random() * 20) + 1;
  if (doorType < 8) {
    return "th";
  } else if (doorType < 15) {
    return "tv";
  } else if (doorType < 17) {
    return "mf";
  } else if (doorType < 19) {
    return Math.floor(Math.random() * 50) + 1; // Dørnummer mellem 1 og 50
  } else {
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyzøæå";
    let door =
      lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
    if (Math.random() < 0.5) {
      door += "-";
    }
    door += Math.floor(Math.random() * 999) + 1; // Bogstav plus tal (f.eks. c3 eller d-14)
    return door;
  }
};

// Hjælper funktion til at generere en tilfældig tekst
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
