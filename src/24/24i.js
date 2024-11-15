/**
 * @param {string} input
 */
module.exports = (input, min = 200000000000000, max = 400000000000000) => {
  const paths = input
    .split("\n")
    .map((line) => line.split(/,? @? ?/))
    .map((data) => {
      const x0 = +data[0];
      const y0 = +data[1];

      const dx = +data[3];
      const dy = +data[4];

      return {
        x0,
        y0,
        dx,
        dy,

        // f(x) = a * x + b
        a: dy / dx,
        b: y0 - (dy / dx) * x0,
      };
    });

  const isInArea = (num) => num <= max && num >= min;

  let numberOfIntersections = 0;
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      const path1 = paths[i];
      const path2 = paths[j];

      const areParallel = path1.a - path2.a === 0;
      if (areParallel) continue;

      const x = (path2.b - path1.b) / (path1.a - path2.a);
      const y = path1.a * x + path1.b;

      if (
        isInArea(x) &&
        isInArea(y) &&
        isInFuture(path1, x) &&
        isInFuture(path2, x)
      ) {
        numberOfIntersections++;
      }
    }
  }

  return numberOfIntersections;
};

const isInFuture = ({ x0, dx }, x) => (x - x0) / dx >= 0;
