/**
 * @param {string} input
 */
module.exports = (input) => {
  const grid = input.split("\n");

  const startBeam = {
    row: 0,
    col: -1,
    dir: "right",
  };

  return calculateEnergizedCellNumber(grid, startBeam);
};

const calculateEnergizedCellNumber = (grid, startBeam) => {
  const visitedCells = new Set();
  const visitedCellsPerDirection = new Set();

  const queue = [startBeam];

  while (queue.length) {
    for (let i = queue.length; i > 0; i--) {
      const { row, col, dir } = queue.shift();

      const nextPosition = calcNewPosition(dir, row, col);
      const nextValue = grid[nextPosition.row]?.[nextPosition.col];
      const nextPositionTag = `${nextPosition.row}-${nextPosition.col}-${dir}`;

      const isOutOfGrid = nextValue === undefined;
      if (isOutOfGrid || visitedCellsPerDirection.has(nextPositionTag)) {
        continue;
      }

      visitedCells.add(`${nextPosition.row}-${nextPosition.col}`);
      visitedCellsPerDirection.add(nextPositionTag);

      if (
        nextValue === "." ||
        (["left", "right"].includes(dir) && nextValue === "-") ||
        (["up", "down"].includes(dir) && nextValue === "|")
      ) {
        queue.push({ ...nextPosition, dir });
      } else if (nextValue === "|") {
        queue.push({ ...nextPosition, dir: "up" });
        queue.push({ ...nextPosition, dir: "down" });
      } else if (nextValue === "-") {
        queue.push({ ...nextPosition, dir: "left" });
        queue.push({ ...nextPosition, dir: "right" });
      } else if (nextValue === "\\") {
        queue.push({ ...nextPosition, dir: mirrorWithBackslash(dir) });
      } else if (nextValue === "/") {
        queue.push({ ...nextPosition, dir: mirrorWithSlash(dir) });
      }
    }
  }

  return visitedCells.size;
};

const mirrorWithBackslash = (dir) =>
  ({
    right: "down",
    down: "right",
    up: "left",
    left: "up",
  }[dir]);

const mirrorWithSlash = (dir) =>
  ({
    right: "up",
    up: "right",
    down: "left",
    left: "down",
  }[dir]);

const calcNewPosition = (dir, row, col) => ({
  row: dir === "down" ? row + 1 : dir === "up" ? row - 1 : row,
  col: dir === "right" ? col + 1 : dir === "left" ? col - 1 : col,
});

module.exports.calculateEnergizedCellNumber = calculateEnergizedCellNumber;
