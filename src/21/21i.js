/**
 * @param {string} input
 */
module.exports = (input, steps = 64) => {
  const map = input.split("\n").map((line) => line.split(""));

  const sIndex = input.indexOf("S");
  const startCoords = {
    x: Math.floor(sIndex / map.length),
    y: sIndex % (map[0].length + 1),
  };
  map[startCoords.x][startCoords.y] = ".";

  // bfs with the trick to remember if a cell is visited in
  // an even or in an odd step, bc that's what matters
  const queue = [startCoords];
  for (let step = 0; step <= steps; step++) {
    for (let i = queue.length; i > 0; i--) {
      const { x, y } = queue.shift();

      if (map?.[x]?.[y] !== ".") continue;

      map[x][y] = step % 2 ? "o" : "e";

      queue.push({ x, y: y - 1 });
      queue.push({ x: x - 1, y });
      queue.push({ x: x + 1, y });
      queue.push({ x, y: y + 1 });
    }
  }

  // console.log(map.map((line) => line.join("")).join("\n"));

  const characterToSearch = steps % 2 ? "o" : "e";

  return map
    .flat()
    .reduce((sum, cell) => sum + (cell === characterToSearch ? 1 : 0), 0);
};

// wrap in a larger algorithm?
// (X, Y, x0, y0, startStep, stepsToFill)
