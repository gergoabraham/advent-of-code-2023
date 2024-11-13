/**
 * @param {string} input
 */
module.exports = (input) => {
  const map = input.split("\n").map((line) => line.split(""));

  const target = { x: map.length - 1, y: map[0].length - 2 };

  const findLongestPath = (coord = { x: 0, y: 1 }, path = new Set()) => {
    if (coord.x === target.x && coord.y === target.y) {
      return path.size;
    }

    const possibleCoordinates = [
      { x: coord.x - 1, y: coord.y, accepted: [".", "^"] },
      { x: coord.x + 1, y: coord.y, accepted: [".", "v"] },
      { x: coord.x, y: coord.y + 1, accepted: [".", ">"] },
      { x: coord.x, y: coord.y - 1, accepted: [".", "<"] },
    ];
    const visitableCoordinates = possibleCoordinates.filter(
      ({ x, y, accepted }) =>
        accepted.includes(map[x]?.[y]) && !path.has(`${x}-${y}`)
    );

    path.add(`${coord.x}-${coord.y}`);
    const distancesToTarget = visitableCoordinates.map(({ x, y }) =>
      findLongestPath({ x, y }, path)
    );
    path.delete(`${coord.x}-${coord.y}`);

    return Math.max(-1, ...distancesToTarget);
  };

  return findLongestPath();
};
