/**
 * @param {string} input
 */
module.exports = (input) => findPathForCrucible(input, 1, 3);

const findPathForCrucible = (input, minSteps, maxSteps) => {
  const grid = input.split("\n");

  // Trick one: distances are stored separately for
  // 'vertically' and 'horizontally' reached nodes
  const distances = { h: initDistances(grid), v: initDistances(grid) };
  distances.v[0][0] = 0;
  distances.h[0][0] = 0;

  const unvisitedSet = initUnvisitedSet(grid);

  while (unvisitedSet.size) {
    const node = getUnvisitedNodeWithMinDistance(unvisitedSet, distances);
    const nodeDistance = distances[node.dir][node.row][node.col];

    if (hasReachedEnd(node, grid)) {
      return nodeDistance;
    }

    unvisitedSet.delete(node);

    // Trick Two: neighbours are the nodes between MIN and MAX steps in the orthogonal directions
    examineNeighbours(node, nodeDistance, maxSteps, grid, minSteps, distances);
  }
};

const initDistances = (grid) =>
  new Array(grid.length)
    .fill(null)
    .map(() => new Array(grid[0].length).fill(Infinity));

const getUnvisitedNodeWithMinDistance = (unvisitedSet, distances) => {
  let currentNode = null;
  let currentDistance = Infinity;

  for (const node of unvisitedSet) {
    const distanceCandidate = distances[node.dir][node.row][node.col];

    if (distanceCandidate < currentDistance) {
      currentNode = node;
      currentDistance = distanceCandidate;
    }
  }

  return currentNode;
};

const hasReachedEnd = (node, grid) =>
  node.row === grid.length - 1 && node.col === grid[0].length - 1;

const initUnvisitedSet = (grid) => {
  const unvisitedSet = new Set();

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      unvisitedSet.add({ row, col, dir: "v" });
      unvisitedSet.add({ row, col, dir: "h" });
    }
  }

  return unvisitedSet;
};

const examineNeighbours = (
  node,
  nodeDistance,
  maxSteps,
  grid,
  minSteps,
  distances
) => {
  if (node.dir === "h") {
    let distance = nodeDistance;

    for (let i = 1; i <= maxSteps; i++) {
      const row = node.row + i;

      if (row < grid.length) {
        distance += +grid[row][node.col];
        if (i >= minSteps && distance < distances.v[row][node.col]) {
          distances.v[row][node.col] = distance;
        }
      }
    }

    distance = nodeDistance;
    for (let i = 1; i <= maxSteps; i++) {
      const row = node.row - i;

      if (row >= 0) {
        distance += +grid[row][node.col];
        if (i >= minSteps && distance < distances.v[row][node.col]) {
          distances.v[row][node.col] = distance;
        }
      }
    }
  } else {
    let distance = nodeDistance;
    for (let i = 1; i <= maxSteps; i++) {
      const col = node.col + i;

      if (col < grid[0].length) {
        distance += +grid[node.row][col];
        if (i >= minSteps && distance < distances.h[node.row][col]) {
          distances.h[node.row][col] = distance;
        }
      }
    }

    distance = nodeDistance;
    for (let i = 1; i <= maxSteps; i++) {
      const col = node.col - i;

      if (col >= 0) {
        distance += +grid[node.row][col];
        if (i >= minSteps && distance < distances.h[node.row][col]) {
          distances.h[node.row][col] = distance;
        }
      }
    }
  }
};

module.exports.findPathForCrucible = findPathForCrucible;
