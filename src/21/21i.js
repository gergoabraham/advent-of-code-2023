/**
 * @param {string} input
 */
module.exports = (input, steps = 64) => {
  const garden = input.split("\n").map((line) => line.split(""));

  const sIndex = input.indexOf("S");
  const startCoords = {
    x: Math.floor(sIndex / garden.length),
    y: sIndex % (garden[0].length + 1),
  };
  garden[startCoords.x][startCoords.y] = ".";

  const targetParity = steps % 2;
  let numberOfCellsReachedWithTargetParity = 0;

  // bfs with the trick to remember if a cell is visited in
  // an even or in an odd step, because every cell reached
  // with a number of steps with the same parity of the total steps
  // can be reached with the total steps
  const queue = [startCoords];
  for (let step = 0; step <= steps; step++) {
    for (let i = queue.length; i > 0; i--) {
      const { x, y } = queue.shift();

      if (garden?.[x]?.[y] !== ".") continue;

      garden[x][y] = "x";

      if (step % 2 === targetParity) numberOfCellsReachedWithTargetParity++;

      queue.push({ x, y: y - 1 });
      queue.push({ x: x - 1, y });
      queue.push({ x: x + 1, y });
      queue.push({ x, y: y + 1 });
    }
  }

  return numberOfCellsReachedWithTargetParity;
};
