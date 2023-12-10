/**
 * @param {string} input
 */
module.exports = (input) => {
  const map = input.split("\n");
  const loopTiles = findLoopTiles(map);

  return loopTiles.size / 2;
};

const findLoopTiles = (map) => {
  const startNode = findStartNode(map);

  const visitedSet = new TileSet();
  visitedSet.add(startNode);

  let node = getNeighbours(map, startNode)[0];
  while (node) {
    visitedSet.add(node);

    const neighbours = getNeighbours(map, node);
    const unvisitedNeighbour = neighbours.find(
      (neighbour) => !visitedSet.has(neighbour)
    );

    node = unvisitedNeighbour;
  }

  return visitedSet;
};

const findStartNode = (map) => {
  const sIndex = map.join("").indexOf("S");
  const startRow = Math.floor(sIndex / map[0].length);
  const startCol = sIndex % map[0].length;

  return [startRow, startCol];
};

const getNeighbours = (map, [row, col]) =>
  [
    canGoNorth(map, row, col) && [row - 1, col],
    canGoSouth(map, row, col) && [row + 1, col],
    canGoWest(map, row, col) && [row, col - 1],
    canGoEast(map, row, col) && [row, col + 1],
  ].filter((x) => x);

const canGoNorth = (map, row, col) =>
  "S|LJ".includes(map[row][col]) && "S|7F".includes(map[row - 1]?.[col]);
const canGoSouth = (map, row, col) =>
  "S|7F".includes(map[row][col]) && "S|LJ".includes(map[row + 1]?.[col]);
const canGoWest = (map, row, col) =>
  "S-J7".includes(map[row][col]) && "S-FL".includes(map[row][col - 1]);
const canGoEast = (map, row, col) =>
  "S-FL".includes(map[row][col]) && "S-J7".includes(map[row][col + 1]);

class TileSet {
  constructor() {
    this.set = new Set();
  }

  add(node) {
    this.set.add(this.getTag(node));
  }

  has(node) {
    return this.set.has(this.getTag(node));
  }

  get size() {
    return this.set.size;
  }

  getTag([row, col]) {
    return `${row}-${col}`;
  }
}

module.exports.findLoopTiles = findLoopTiles;
module.exports.canGoNorth = canGoNorth;
module.exports.canGoSouth = canGoSouth;
module.exports.canGoWest = canGoWest;
module.exports.canGoEast = canGoEast;
