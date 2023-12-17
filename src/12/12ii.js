const { calculateTheNumberOfPossibleArrangements } = require("./12i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const records = input.split("\n").map((line) => {
    const record = line.split(" ");

    const springsExpanded = new Array(5).fill(record[0]).join("?");
    const groupsExpanded = new Array(5)
      .fill(record[1])
      .join(",")
      .split(",")
      .map((x) => +x);

    return [springsExpanded, groupsExpanded];
  });

  const numberOfPossibleArrangements = records.map(
    calculateTheNumberOfPossibleArrangements
  );

  return numberOfPossibleArrangements.reduce((sum, num) => sum + num);
};
