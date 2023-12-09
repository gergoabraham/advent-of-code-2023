const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  0: 0,
};

module.exports = (input) => {
  return input
    .split("\n")
    .filter((x) => x)
    .map((line) => {
      let first;
      let i = 0;
      while (first === undefined) {
        for (const number in numbers) {
          if (line.startsWith(number, i)) {
            first = numbers[number];
            break;
          }
        }
        i++;
      }

      let last;
      i = line.length - 1;
      while (last === undefined) {
        for (const number in numbers) {
          if (line.startsWith(number, i)) {
            last = numbers[number];
            break;
          }
        }
        i--;
      }

      return 10 * first + last;
    })
    .reduce((acc, num) => acc + num);
};
