const {
  findLoopTiles,
  canGoNorth,
  canGoSouth,
  canGoWest,
  canGoEast,
} = require("./10i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const map = input.split("\n");
  const loopTiles = findLoopTiles(map);

  const rows = map.length;
  const columns = map[0].length;

  let enclosedTiles = 0;
  let isIn = false;
  let loopCorner = null;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const tile = getTile(map, row, col);
      const isItOnLoop = loopTiles.has([row, col]);

      if (isItOnLoop) {
        if (tile === "|") {
          isIn = !isIn;
        } else if (tile === "F") {
          loopCorner = tile;
        } else if (tile === "J") {
          if (loopCorner === "F") {
            isIn = !isIn;
          }
          loopCorner = null;
        } else if (tile === "L") {
          loopCorner = tile;
        } else if (tile === "7") {
          if (loopCorner === "L") {
            isIn = !isIn;
          }
          loopCorner = null;
        }
      } else {
        if (isIn) {
          enclosedTiles++;
        }
      }
    }
  }

  return enclosedTiles;
};

const getTile = (map, row, col) => {
  let tile = map[row][col];

  if (tile === "S") {
    const tiles = { NS: "|", NW: "J", NE: "L", SW: "7", SE: "F", WE: "-" };
    const type = [
      canGoNorth(map, row, col) && "N",
      canGoSouth(map, row, col) && "S",
      canGoWest(map, row, col) && "W",
      canGoEast(map, row, col) && "E",
    ]
      .filter((x) => x)
      .join("");

    tile = tiles[type];
  }

  return tile;
};
