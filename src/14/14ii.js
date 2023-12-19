const TARGET_CYCLE = 1000000000;

/**
 * @param {string} input
 */
module.exports = (input) => {
  let dish = input.split("\n").map((line) => line.split(""));

  const memoByDish = new Map();
  const memoByCycle = new Map();

  let cycle;
  for (cycle = 1; cycle <= TARGET_CYCLE; cycle++) {
    applySpinCycleOnDish(dish);

    const tag = toTag(dish);
    if (memoByDish.has(tag)) break;

    memoByDish.set(tag, cycle);
    memoByCycle.set(cycle, tag);
  }

  const targetDish = extrapolateForTargetDish(
    memoByDish,
    dish,
    cycle,
    memoByCycle
  );

  return calculateNorthBeamLoad(targetDish);
};

const toTag = (dish) => dish.map((line) => line.join("")).join("\n");

const applySpinCycleOnDish = (dish) => {
  for (const direction of directions(dish)) {
    for (let outer = 0; outer < direction.outerLength; outer++) {
      let target = 0;

      for (let inner = 0; inner < direction.innerLength; inner++) {
        const value = direction.get(dish, outer, inner);

        if (value === "O") {
          if (target !== inner) {
            direction.set(dish, outer, target, "O");
            direction.set(dish, outer, inner, ".");
          }
          target++;
        } else if (value === "#") {
          target = inner + 1;
        }
      }
    }
  }
};

const directions = (dish) => [
  {
    // north
    outerLength: dish[0].length,
    innerLength: dish.length,
    get: (dish, outer, inner) => dish[inner][outer],
    set: (dish, outer, inner, value) => {
      dish[inner][outer] = value;
    },
  },

  {
    // west
    outerLength: dish.length,
    innerLength: dish[0].length,
    get: (dish, outer, inner) => dish[outer][inner],
    set: (dish, outer, inner, value) => {
      dish[outer][inner] = value;
    },
  },

  {
    // south
    outerLength: dish[0].length,
    innerLength: dish.length,
    get: (dish, outer, inner) => dish[dish.length - inner - 1][outer],
    set: (dish, outer, inner, value) => {
      dish[dish.length - inner - 1][outer] = value;
    },
  },

  {
    // east
    outerLength: dish.length,
    innerLength: dish[0].length,
    get: (dish, outer, inner) => dish[outer][dish[0].length - inner - 1],
    set: (dish, outer, inner, value) => {
      dish[outer][dish[0].length - inner - 1] = value;
    },
  },
];

const extrapolateForTargetDish = (memo, dish, cycle, memoByCycle) => {
  const startCycle = memo.get(toTag(dish));
  const endCycle = cycle - 1;
  const period = endCycle - startCycle + 1;
  const sameAsTargetCycle = ((TARGET_CYCLE - startCycle) % period) + startCycle;

  const targetDish = memoByCycle.get(sameAsTargetCycle).split("\n");

  return targetDish;
};

const calculateNorthBeamLoad = (dish) => {
  const maxLoad = dish.length;
  let totalLoad = 0;

  for (let row = 0; row < dish.length; row++) {
    for (let col = 0; col < dish[0].length; col++) {
      if (dish[row][col] === "O") {
        totalLoad += maxLoad - row;
      }
    }
  }

  return totalLoad;
};
