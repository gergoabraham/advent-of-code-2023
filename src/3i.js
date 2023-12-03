module.exports = (input) => {
  const numbers = getPartNumbers(input);

  return numbers.reduce(
    (sum, { symbol, number }) => sum + (symbol ? number : 0),
    0
  );
};

const digits = "0123456789";

const getPartNumbers = (input) => {
  const schematic = input.split("\n");

  const numbers = [];
  let symbol = null;
  let number = 0;

  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < schematic[i].length; j++) {
      const char = schematic[i][j];

      if (digits.includes(char)) {
        number = number * 10 + +char;

        const neighbouringSymbol = getNeighbouringSybol(schematic, i, j);
        symbol = symbol || neighbouringSymbol;
      } else {
        if (number !== 0) {
          numbers.push({ number, symbol });
          number = 0;
          symbol = null;
        }
      }
    }

    if (number !== 0) {
      numbers.push({ number, symbol });
      number = 0;
      symbol = null;
    }
  }

  return numbers;
};

const getNeighbouringSybol = (schematic, i, j) => {
  for (let ii = i - 1; ii <= i + 1; ii++) {
    for (let jj = j - 1; jj <= j + 1; jj++) {
      if (ii === i && jj === j) continue;

      const value = schematic[ii]?.[jj];

      if (value && value !== "." && !digits.includes(value)) {
        return { value, i: ii, j: jj };
      }
    }
  }

  const neighbours = [
    schematic[i - 1]?.[j - 1],
    schematic[i - 1]?.[j],
    schematic[i - 1]?.[j + 1],
    schematic[i]?.[j + 1],
    schematic[i + 1]?.[j + 1],
    schematic[i + 1]?.[j],
    schematic[i + 1]?.[j - 1],
    schematic[i]?.[j - 1],
  ];

  return neighbours.find((x) => x && x !== "." && !digits.includes(x));
};

module.exports.getPartNumbers = getPartNumbers;
