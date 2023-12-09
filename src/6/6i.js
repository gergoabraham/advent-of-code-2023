/**
 * @param {string} input
 */
module.exports = (input) => {
  const [times, distances] = input.split("\n").map((line) =>
    line
      .split(/ +/)
      .slice(1)
      .map((x) => +x)
  );

  const numberOfWinningOptions = times.map((t, i) =>
    calculateNumberOfWinningOptions(t, distances[i])
  );

  return numberOfWinningOptions.reduce((acc, num) => acc * num);
};

const calculateNumberOfWinningOptions = (t, d) => {
  const sqrtB2minus4ac = Math.sqrt(t * t - 4 * d);

  const minPrecise = (t - sqrtB2minus4ac) / 2;
  const maxPrecise = (t + sqrtB2minus4ac) / 2;

  const min = Math.floor(minPrecise + 1);
  const max = Math.ceil(maxPrecise - 1);

  return max - min + 1;
};

module.exports.calculateNumberOfWinningOptions =
  calculateNumberOfWinningOptions;
