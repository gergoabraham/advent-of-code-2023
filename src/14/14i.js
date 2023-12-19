/**
 * @param {string} input
 */
module.exports = (input) => {
  const dish = input.split("\n");

  return calculateNorthBeamLoadByTilting(dish);
};

const calculateNorthBeamLoadByTilting = (dish) => {
  const maxLoad = dish.length;
  let totalLoad = 0;

  for (let col = 0; col < dish[0].length; col++) {
    let targetRow = 0;
    for (let sourceRow = 0; sourceRow < dish.length; sourceRow++) {
      const value = dish[sourceRow][col];

      if (value === "O") {
        totalLoad += maxLoad - targetRow;
        targetRow++;
      } else if (value === "#") {
        targetRow = sourceRow + 1;
      }
    }
  }

  return totalLoad;
};
