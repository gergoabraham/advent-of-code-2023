/**
 * @param {string} input
 */
module.exports = (input) =>
  calculateSumOfExtrapolatedValues({
    extrapolateCallback: extrapolateNextValue,
    input,
  });

const calculateSumOfExtrapolatedValues = ({ input, extrapolateCallback }) => {
  const histories = input
    .split("\n")
    .map((line) => line.split(" ").map((x) => +x));

  const extrapolatedValues = histories.map(extrapolateCallback);

  return extrapolatedValues.reduce((sum, num) => sum + num);
};

const extrapolateNextValue = (array) => {
  if (array.every((value) => value === 0)) {
    return 0;
  } else {
    return array[array.length - 1] + extrapolateNextValue(getDiffArray(array));
  }
};

const getDiffArray = (array) => {
  const diffArray = new Array(array.length - 1);
  for (let i = 0; i < diffArray.length; i++) {
    diffArray[i] = array[i + 1] - array[i];
  }
  return diffArray;
};

module.exports.calculateSumOfExtrapolatedValues =
  calculateSumOfExtrapolatedValues;
module.exports.getDiffArray = getDiffArray;
