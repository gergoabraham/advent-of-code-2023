/**
 * @param {string} input
 */
module.exports = (input) => {
  const records = input.split("\n").map((line) => {
    const record = line.split(" ");

    const springs = record[0];
    const groups = record[1].split(",").map((x) => +x);

    return [springs, groups];
  });

  const numberOfPossibleArrangements = records.map(
    calculateTheNumberOfPossibleArrangements
  );

  return numberOfPossibleArrangements.reduce((sum, num) => sum + num);
};

const calculateTheNumberOfPossibleArrangements = ([springs, groups]) => {
  const memo = new Map();

  const solve = (springs, groups) => {
    const tag = `${springs} ${groups.join(",")}`;

    if (!memo.has(tag)) {
      let result;

      if (isSolved(springs, groups)) {
        result = 1;
      } else if (isImpossibleToSolve(springs, groups)) {
        result = 0;
      } else {
        const canSkipSpring = springs[0] !== "#";
        const solutionsBySkippingSpring = canSkipSpring
          ? solve(springs.slice(1), groups)
          : 0;

        const groupSize = groups[0];
        const solutionsByApplyingGroup = canApplyGroup(springs, groupSize)
          ? solve(springs.slice(groupSize + 1), groups.slice(1))
          : 0;

        result = solutionsBySkippingSpring + solutionsByApplyingGroup;
      }

      memo.set(tag, result);
    }

    return memo.get(tag);
  };

  return solve(springs, groups);
};

const isSolved = (springs, groups) =>
  groups.length === 0 && !springs.includes("#");

const isImpossibleToSolve = (springs, groups) =>
  springs.length === 0 || (groups.length === 0 && springs.includes("#"));

const canApplyGroup = (springs, groupSize) =>
  springs.length >= groupSize &&
  [...springs.slice(0, groupSize)].every((x) => x !== ".") &&
  springs[groupSize] !== "#";

module.exports.calculateTheNumberOfPossibleArrangements =
  calculateTheNumberOfPossibleArrangements;
