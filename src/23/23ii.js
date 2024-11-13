/**
 * @param {string} input
 */
module.exports = (input) => {
  // build a linked-list representation graph of the 'crossroads' nodes
  const { startNode, targetNode } = buildGraph(input);

  // perform longest path search on this graph, bc wikipedia says it is NP-hard,
  // so this is just an optimization to have a smaller data to work on
  // result:
  // - original algorithm from 1st part changed to this problem ran in 59 minutes
  // - this solution ran in 8 seconds
  return findLongestPath(startNode, targetNode);
};

class Node {
  neighborsMap = new Map();

  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.tag = coordToTag({ x, y });
  }
}

class Graph {
  nodes = new Map();

  new({ x, y }) {
    const newNode = new Node({ x, y });
    this.nodes.set(newNode.tag, newNode);
    return newNode;
  }
  get({ x, y }) {
    return this.nodes.get(coordToTag({ x, y }));
  }
  has({ x, y }) {
    return this.nodes.has(coordToTag({ x, y }));
  }
}

const coordToTag = ({ x, y }) => `${x}-${y}`;

const buildGraph = (input) => {
  const map = input
    .replaceAll(/[><^v]/g, ".")
    .split("\n")
    .map((line) => line.split(""));

  const startCoords = { x: 0, y: 1 };
  const targetCoords = { x: map.length - 1, y: map[0].length - 2 };

  const nodes = new Graph();
  const startNode = nodes.new(startCoords);
  const targetNode = nodes.new(targetCoords);

  const visitedCoords = new Set([coordToTag(startCoords)]);

  const findNeighbors = (coord) => {
    visitedCoords.add(coordToTag(coord));

    const possiblePathCoords = getPossiblePathCoords(coord, map);
    const unvisitedPathCoords = possiblePathCoords.filter(
      (coord) => !visitedCoords.has(coordToTag(coord))
    );

    return unvisitedPathCoords.map((unvisitedPathCoord) =>
      findNextCrossroads(unvisitedPathCoord)
    );
  };

  const findNextCrossroads = (coord, distance = 1) => {
    visitedCoords.add(coordToTag(coord));

    const possiblePathCoords = getPossiblePathCoords(coord, map);

    const isCrossroads = possiblePathCoords.length > 2;
    const isTarget = coordToTag(coord) === coordToTag(targetCoords);

    if (isCrossroads || isTarget) {
      return { coord, distance };
    } else {
      const nextCoord =
        possiblePathCoords.find((cd) => !visitedCoords.has(coordToTag(cd))) ??
        possiblePathCoords.find((cd) => nodes.has(cd));

      return findNextCrossroads(nextCoord, distance + 1);
    }
  };

  const nodeQueue = [startNode];
  while (nodeQueue.length) {
    const startNode = nodeQueue.shift();

    const neighbors = findNeighbors(startNode);

    neighbors.forEach(({ coord: neighbor, distance }) => {
      if (!nodes.has(neighbor)) {
        const neighborNode = nodes.new(neighbor);
        nodeQueue.push(neighborNode);
      }

      // simplification:  this works bc there are no neighbor nodes connected directly by multiple paths
      const neighborNode = nodes.get(neighbor);
      startNode.neighborsMap.set(neighborNode, distance);
      neighborNode.neighborsMap.set(startNode, distance);
    });
  }

  return { nodes, startNode, targetNode };
};

const getPossiblePathCoords = (coord, map) => {
  const possibleCoordinates = [
    { x: coord.x + 1, y: coord.y },
    { x: coord.x - 1, y: coord.y },
    { x: coord.x, y: coord.y + 1 },
    { x: coord.x, y: coord.y - 1 },
  ];

  return possibleCoordinates.filter(({ x, y }) => map[x]?.[y] === ".");
};

const findLongestPath = (
  currentNode,
  targetNode,
  path = new Set(),
  elapsedDistance = 0
) => {
  if (currentNode === targetNode) {
    return elapsedDistance;
  }

  path.add(currentNode);
  const distancesToTarget = [...currentNode.neighborsMap]
    .filter(([node]) => !path.has(node))
    .map(([node, distance]) =>
      findLongestPath(node, targetNode, path, elapsedDistance + distance)
    );
  path.delete(currentNode);

  return Math.max(-1, ...distancesToTarget);
};
