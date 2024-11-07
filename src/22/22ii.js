const {
  buildBrickBricks,
  buildTopViewMap,
  dropBricksAndBuildConnections,
} = require("./22i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const bricks = buildBrickBricks(input);
  const topView = buildTopViewMap(bricks);
  dropBricksAndBuildConnections(bricks, topView);

  let totalFalling = 0;
  for (const startBrick of bricks) {
    totalFalling += countFallingBricksAbove(startBrick);
  }

  return totalFalling;
};

const countFallingBricksAbove = (startBrick) => {
  const outsideSupportersOfTargetBricks = new Map();
  outsideSupportersOfTargetBricks.set(startBrick, new Set());

  const targetBricks = [startBrick];

  let howManyWillFall = -1; // starter brick doesn't count

  while (outsideSupportersOfTargetBricks.get(targetBricks[0])?.size === 0) {
    // target with no supporters from outside of the group is added to the falling group
    const targetBrick = targetBricks.shift();
    outsideSupportersOfTargetBricks.delete(targetBrick);
    howManyWillFall++;

    // and its children are added to the target group if needed
    for (const child of targetBrick.supports) {
      if (!outsideSupportersOfTargetBricks.has(child)) {
        const supportersOfChild = new Set(child.supportedBy);
        supportersOfChild.delete(targetBrick);

        outsideSupportersOfTargetBricks.set(child, supportersOfChild);
        targetBricks.push(child);
      } else {
        outsideSupportersOfTargetBricks.get(child).delete(targetBrick);
      }
    }

    targetBricks.sort(
      (a, b) =>
        outsideSupportersOfTargetBricks.get(a).size -
        outsideSupportersOfTargetBricks.get(b).size
    );
  }
  return howManyWillFall;
};
