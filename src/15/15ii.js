const { toHash } = require("./15i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const operations = parseOperations(input);
  const boxes = fillBoxesWithLens(operations);
  const focusingPower = sumFocusingPower(boxes);

  return focusingPower;
};

const parseOperations = (input) =>
  input.split(",").map((op) => {
    if (op.endsWith("-")) {
      return [op.slice(0, -1), "-"];
    } else {
      return op.split("=");
    }
  });

const fillBoxesWithLens = (operations) => {
  const boxes = new Map();

  for (const [lens, op] of operations) {
    const hash = toHash(lens);
    const box = boxes.get(hash) ?? new Map();

    if (op === "-") {
      box.delete(lens);
    } else {
      box.set(lens, op);
    }

    boxes.set(hash, box);
  }

  return boxes;
};

const sumFocusingPower = (boxes) => {
  let focusingPower = 0;

  for (const [box, lenses] of boxes) {
    let slot = 1;

    for (const focalLength of lenses.values()) {
      focusingPower += (box + 1) * slot * focalLength;
      slot++;
    }
  }

  return focusingPower;
};
