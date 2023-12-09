const { getPartNumbers } = require("./3i");

module.exports = (input) => {
  const partNumbers = getPartNumbers(input);

  const possibleGearRatios = new Map();
  partNumbers.forEach(({ number, symbol }) => {
    if (symbol && symbol.value === "*") {
      const id = `${symbol.i}-${symbol.j}`;

      if (possibleGearRatios.has(id)) {
        possibleGearRatios.get(id).push(number);
      } else {
        possibleGearRatios.set(id, [number]);
      }
    }
  });

  let result = 0;
  possibleGearRatios.forEach((ratios) => {
    if (ratios.length === 2) {
      result += ratios[0] * ratios[1];
    }
  });

  return result;
};
