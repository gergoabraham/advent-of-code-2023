/**
 * @param {string} input
 */
module.exports = (input) => summarizeReflectionPointsWithDesiredDiff(input, 0);

const summarizeReflectionPointsWithDesiredDiff = (input, desiredDiff) => {
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));

  const horizontalReflections = patterns.map(
    findHorizontalReflections(desiredDiff)
  );

  const transposedPatterns = patterns.map(transpose);
  const verticalReflections = transposedPatterns.map(
    findHorizontalReflections(desiredDiff)
  );

  return 100 * sum(horizontalReflections) + sum(verticalReflections);
};

const findHorizontalReflections = (desiredDiff) => (pattern) => {
  for (let i = 0; i < pattern.length - 1; i++) {
    let diff = calculateDiff(pattern[i], pattern[i + 1]);

    if (diff <= desiredDiff) {
      for (let a = i - 1, b = i + 2; a >= 0 && b < pattern.length; a--, b++) {
        diff += calculateDiff(pattern[a], pattern[b]);
        if (diff > desiredDiff) {
          break;
        }
      }

      if (diff === desiredDiff) {
        return i + 1;
      }
    }
  }

  return 0;
};

const calculateDiff = (a, b) => {
  let diffs = 0;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diffs++;
  }

  return diffs;
};

const sum = (arr) => arr.reduce((sum, num) => sum + num);

const transpose = (pattern) => {
  const transposedPattern = new Array(pattern[0].length);

  const line = new Array(pattern.length);
  for (let i = 0; i < transposedPattern.length; i++) {
    for (let j = 0; j < pattern.length; j++) {
      line[j] = pattern[j][i];
    }

    transposedPattern[i] = line.join("");
  }

  return transposedPattern;
};

module.exports.summarizeReflectionPointsWithDesiredDiff =
  summarizeReflectionPointsWithDesiredDiff;
