/**
 * @param {string} input
 */
module.exports = (input, steps = 26501365) => {
  const numberOfTiles = 9;

  // each tile is one garden - we have 9 by 9 gardens
  const gardenTiles = generateTiles(numberOfTiles, () => generateGarden(input));
  const reachedCellsPerTile = generateTiles(numberOfTiles, () => ({
    evens: 0,
    odds: 0,
  }));

  const gardenSize = gardenTiles[0][0].length;
  const sIndex = input.indexOf("S");
  const startCoords = {
    x:
      Math.floor(sIndex / gardenSize) + // starting from the garden in the middle tile
      Math.floor(numberOfTiles / 2) * gardenSize,
    y: (sIndex % (gardenSize + 1)) + Math.floor(numberOfTiles / 2) * gardenSize,
  };

  const getTile = (gardenTiles, x, y) =>
    gardenTiles[Math.floor(x / gardenSize)][Math.floor(y / gardenSize)];
  const getField = (gardenTiles, x, y) =>
    getTile(gardenTiles, x, y)[x % gardenSize][y % gardenSize];
  const setField = (x, y, value) => {
    getTile(gardenTiles, x, y)[x % gardenSize][y % gardenSize] = value;
  };

  const minSteps = Math.floor(((numberOfTiles - 2) / 2) * gardenSize) + 1;
  const stepsToTake = Math.min(
    steps,
    ((steps - minSteps) % gardenSize) + minSteps
  );

  // bfs to walk in 9x9 gardens
  const queue = [startCoords];
  for (let step = 0; step <= stepsToTake; step++) {
    for (let i = queue.length; i > 0; i--) {
      const { x, y } = queue.shift();

      if (getField(gardenTiles, x, y) !== ".") continue;

      const parity = step % 2 ? "o" : "e";
      setField(x, y, parity);

      if (parity === "e") {
        getTile(reachedCellsPerTile, x, y).evens++;
      } else {
        getTile(reachedCellsPerTile, x, y).odds++;
      }

      queue.push({ x, y: y - 1 });
      queue.push({ x: x - 1, y });
      queue.push({ x: x + 1, y });
      queue.push({ x, y: y + 1 });
    }
  }

  // printMap(xSize, SIZE, gardenSize, getField);

  const isExtrapolationNeeded =
    steps >
    Math.floor(gardenSize / 2) + gardenSize * Math.floor(numberOfTiles / 2);

  if (isExtrapolationNeeded) {
    // number of tiles from center to top with the total steps taken
    const numberOfOuterTiles = Math.floor(
      (steps + gardenSize / 2) / gardenSize
    );

    const targetParity = steps % 2 === 0 ? "evens" : "odds";

    const targetParityOnEdgeTiles =
      numberOfOuterTiles % 2 !== 0
        ? steps % 2 === 0
          ? "odds"
          : "evens"
        : targetParity;

    // 4...12...20... times => 4...16...36...64 times => 3: 2**2, 5: 4**2, 7: 6**2, 9: 8**2
    const numberOfTilesInOddCircles =
      (Math.floor((numberOfOuterTiles - 2) / 2) * 2) ** 2;

    // 4:1 6:2  8:3
    // 8...16...24...32...40 times, sum of arithmetic progression
    const n = Math.floor((numberOfOuterTiles - 3) / 2);
    const numberOfTilesInEvenCircles = ((n + 1) * 8 * n) / 2;

    const center = Math.floor(numberOfTiles / 2);
    const end = numberOfTiles - 1;

    const sums = [
      // center tile
      reachedCellsPerTile[center][center][targetParity],

      // inner tiles extrapolated - odd and even circles around center, since step parity changes in every circle
      reachedCellsPerTile[center + 1][center][targetParity] *
        numberOfTilesInOddCircles,
      reachedCellsPerTile[center][center][targetParity] *
        numberOfTilesInEvenCircles,

      // corners + next to them
      reachedCellsPerTile[center][0][targetParityOnEdgeTiles],
      reachedCellsPerTile[center][1][targetParityOnEdgeTiles],
      reachedCellsPerTile[center][2][targetParityOnEdgeTiles],

      reachedCellsPerTile[center][end][targetParityOnEdgeTiles],
      reachedCellsPerTile[center][end - 1][targetParityOnEdgeTiles],
      reachedCellsPerTile[center][end - 2][targetParityOnEdgeTiles],

      reachedCellsPerTile[0][center][targetParityOnEdgeTiles],
      reachedCellsPerTile[1][center][targetParityOnEdgeTiles],
      reachedCellsPerTile[2][center][targetParityOnEdgeTiles],

      reachedCellsPerTile[end][center][targetParityOnEdgeTiles],
      reachedCellsPerTile[end - 1][center][targetParityOnEdgeTiles],
      reachedCellsPerTile[end - 2][center][targetParityOnEdgeTiles],

      // top right outer parts
      reachedCellsPerTile[0][center + 1][targetParityOnEdgeTiles] *
        numberOfOuterTiles,
      reachedCellsPerTile[1][center + 1][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 1),
      reachedCellsPerTile[2][center + 1][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 2),
      reachedCellsPerTile[3][center + 1][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 3),

      // bottom right outer parts
      reachedCellsPerTile[center + 1][end][targetParityOnEdgeTiles] *
        numberOfOuterTiles,
      reachedCellsPerTile[center + 1][end - 1][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 1),
      reachedCellsPerTile[center + 1][end - 2][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 2),
      reachedCellsPerTile[center + 1][end - 3][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 3),

      // bottom left outer parts
      reachedCellsPerTile[end][center - 1][targetParityOnEdgeTiles] *
        numberOfOuterTiles,
      reachedCellsPerTile[end - 1][center - 1][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 1),
      reachedCellsPerTile[end - 2][center - 1][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 2),
      reachedCellsPerTile[end - 3][center - 1][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 3),

      // top left outer parts
      reachedCellsPerTile[center - 1][0][targetParityOnEdgeTiles] *
        numberOfOuterTiles,
      reachedCellsPerTile[center - 1][1][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 1),
      reachedCellsPerTile[center - 1][2][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 2),
      reachedCellsPerTile[center - 1][3][targetParityOnEdgeTiles] *
        (numberOfOuterTiles - 3),
    ];

    return sums.reduce((sum, tile) => sum + tile);
  } else {
    const characterToSearch = steps % 2 ? "o" : "e";
    return gardenTiles
      .flat(3)
      .reduce((sum, cell) => sum + (cell === characterToSearch ? 1 : 0), 0);
  }
};

function printMap(xSize, SIZE, gardenSize, getField) {
  for (let x = 0; x < xSize * SIZE; x++) {
    if (x % xSize === 0) console.log("-".repeat(SIZE * (xSize + 1)));

    const line = [];
    for (let y = 0; y < gardenSize * SIZE; y++) {
      if (y % gardenSize === 0) line.push("|");
      line.push(getField(x, y));
    }

    console.log(line.join(""));
  }
}

const generateGarden = (input) =>
  input
    .split("\n")
    .map((line) => line.split("").map((c) => (c === "S" ? "." : c)));

const generateTiles = (size, tileGenerator) =>
  new Array(size).fill(0).map(() => new Array(size).fill(0).map(tileGenerator));
