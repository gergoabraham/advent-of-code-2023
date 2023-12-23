/**
 * @param {string} input
 */
module.exports = (input) => {
  const digPlan = parseDigPlan(input);

  return calculateAreaByDigPlan(digPlan);
};

const parseDigPlan = (input) =>
  input.split("\n").map((line) => {
    const [, dir, dist, color] = line.match(/(\w) (\d+) \((.+)\)/);
    return { dir, dist: +dist, color };
  });

const calculateAreaByDigPlan = (digPlan) => {
  const { startCoords, width, height } = defineGridBoundaries(digPlan);

  const grid = new Array(height)
    .fill(null)
    .map(() => new Array(width).fill("."));

  drawBorders(startCoords, grid, digPlan);
  fillInnerGrid(grid);

  console.log(grid.map((line) => line.join("")).join("\n"));

  return grid.flat().filter((x) => "#+".includes(x)).length;
};

const defineGridBoundaries = (digPlan) => {
  let node = { x: 0, y: 0 };
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const { dir, dist } of digPlan) {
    node = getNewPosition(node, dir, dist);
    minX = Math.min(minX, node.x);
    maxX = Math.max(maxX, node.x);
    minY = Math.min(minY, node.y);
    maxY = Math.max(maxY, node.y);
  }

  const startCoords = { x: -minX, y: -minY };
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  return { startCoords, width, height };
};

const getNewPosition = ({ x, y }, dir, dist) => ({
  x: dir === "L" ? x - dist : dir === "R" ? x + dist : x,
  y: dir === "U" ? y - dist : dir === "D" ? y + dist : y,
});

const drawBorders = (startCoords, grid, digPlan) => {
  const node = { ...startCoords };
  grid[node.y][node.x] = "#";

  for (const { dir, dist } of digPlan) {
    const { coord, value } = stepInstructions[dir];

    for (let step = 0; step < dist; step++) {
      node[coord] += value;
      grid[node.y][node.x] = "#";
    }
  }
};

const stepInstructions = {
  L: { coord: "x", value: -1 },
  R: { coord: "x", value: 1 },
  U: { coord: "y", value: -1 },
  D: { coord: "y", value: 1 },
};

const fillInnerGrid = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    let upper = false;
    let lower = false;
    let inside = false;

    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === "#") {
        if (grid[row - 1]?.[col] === "#" && grid[row + 1]?.[col] === "#") {
          inside = !inside;
        } else if (grid[row - 1]?.[col] === "#") {
          upper = !upper;
        } else if (grid[row + 1]?.[col] === "#") {
          lower = !lower;
        }

        if (lower && upper) {
          inside = !inside;
          lower = false;
          upper = false;
        }
      }

      if (grid[row][col] !== "#" && inside) {
        grid[row][col] = "+";
      }
    }
  }
};

module.exports.getNewPosition = getNewPosition;
