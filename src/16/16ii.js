const { calculateEnergizedCellNumber } = require("./16i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const grid = input.split("\n");

  let maxEnergizedCells = 0;

  for (let col = 0; col < grid[0].length; col++) {
    const beamFromTop = { row: -1, col, dir: "down" };
    const beamFromBottom = { row: grid.length, col, dir: "up" };

    const fromTop = calculateEnergizedCellNumber(grid, beamFromTop);
    const fromBottom = calculateEnergizedCellNumber(grid, beamFromBottom);

    maxEnergizedCells = Math.max(maxEnergizedCells, fromTop, fromBottom);
  }

  for (let row = 0; row < grid.length; row++) {
    const beamFromLeft = { row, col: -1, dir: "right" };
    const beamFromRight = { row, col: grid[0].length, dir: "left" };

    const fromLeft = calculateEnergizedCellNumber(grid, beamFromLeft);
    const fromRight = calculateEnergizedCellNumber(grid, beamFromRight);

    maxEnergizedCells = Math.max(maxEnergizedCells, fromLeft, fromRight);
  }

  return maxEnergizedCells;
};
