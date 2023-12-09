const { getDiffArray, calculateSumOfExtrapolatedValues } = require("./9i");

/**
 * @param {string} input
 */
module.exports = (input) =>
  calculateSumOfExtrapolatedValues({
    extrapolateCallback: extrapolatePreviousValue,
    input,
  });

const extrapolatePreviousValue = (array) => {
  if (array.every((value) => value === 0)) {
    return 0;
  } else {
    return array[0] - extrapolatePreviousValue(getDiffArray(array));
  }
};
