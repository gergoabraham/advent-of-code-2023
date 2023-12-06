const { calculateNumberOfWinningOptions } = require("./6i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const [t, d] = input.split("\n").map((line) => +line.match(/\d/g).join(""));

  return calculateNumberOfWinningOptions(t, d);
};
