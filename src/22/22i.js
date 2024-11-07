/**
 * @param {string} input
 */
module.exports = (input) => {
  const bricks = buildBrickBricks(input);
  const topView = buildTopViewMap(bricks);

  dropBricksAndBuildConnections(bricks, topView);

  const safelyRemovableBricks = bricks.filter((brick) =>
    [...brick.supports.values()].every(
      (supportedBrick) => supportedBrick.supportedBy.size > 1
    )
  );

  return safelyRemovableBricks.length;
};

class Brick {
  /**
   * @param {{x: number, y: number; z: number}} start
   * @param {{x: number, y: number; z: number}} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;

    this.supportedBy = new Set();
    this.supports = new Set();
  }
}

const buildBrickBricks = (input) =>
  input.split("\n").map((line) => {
    const [x0, y0, z0, x1, y1, z1] = line.split(/[,~]/).map((x) => +x);

    return new Brick({ x: x0, y: y0, z: z0 }, { x: x1, y: y1, z: z1 });
  });

const buildTopViewMap = (bricks) => {
  const { maxX, maxY } = bricks.reduce(
    ({ maxX, maxY }, brick) => ({
      maxX: Math.max(maxX, brick.start.x, brick.end.x),
      maxY: Math.max(maxY, brick.start.y, brick.end.y),
    }),
    { maxX: 0, maxY: 0 }
  );

  return new Array(maxX + 1)
    .fill(0)
    .map(() => new Array(maxY + 1).fill(0).map(() => ({ brick: null, z: 0 })));
};

const dropBricksAndBuildConnections = (bricks, topView) => {
  bricks.sort(
    (a, b) => Math.min(a.start.z, a.end.z) - Math.min(b.start.z, b.end.z)
  );

  bricks.forEach((brick) => {
    let maxZ = 0;

    iterateOnXYCoords(brick, (x, y) => {
      maxZ = Math.max(maxZ, topView[x][y].z);
    });

    iterateOnXYCoords(brick, (x, y) => {
      const isSupportedHere = topView[x][y].z === maxZ;
      if (isSupportedHere) {
        const supportingBrick = topView[x][y].brick;

        supportingBrick?.supports?.add?.(brick);
        brick.supportedBy.add(supportingBrick);
      }

      topView[x][y].brick = brick;
      topView[x][y].z = maxZ + brick.end.z - brick.start.z + 1;
    });
  });
};

const iterateOnXYCoords = (brick, callback) => {
  for (let x = brick.start.x; x <= brick.end.x; x++) {
    for (let y = brick.start.y; y <= brick.end.y; y++) {
      callback(x, y);
    }
  }
};

module.exports.buildBrickBricks = buildBrickBricks;
module.exports.buildTopViewMap = buildTopViewMap;
module.exports.dropBricksAndBuildConnections = dropBricksAndBuildConnections;
