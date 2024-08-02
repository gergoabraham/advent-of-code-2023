const { buildModulesGraph, performOneFullPulsePropagation } = require("./20i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const modules = buildModulesGraph(input);
  const broadcaster = modules.broadcaster;

  let buttonPresses = 0;

  // rx receives LOW if the conjugation module before rx receives HIGH from all of its inputs modules.
  // as that happens after quite a lot of iterations, instead of watching rx, let's examine when the
  // input modules of the module before rx give HIGH, one by one.
  const moduleBeforeRx = modules.lg;
  const whenDoInputModulesGiveHigh = new Map();

  const onPulseCallback = (pulse) => {
    if (pulse.target === moduleBeforeRx && pulse.type === HIGH) {
      if (!whenDoInputModulesGiveHigh.has(pulse.source)) {
        whenDoInputModulesGiveHigh.set(pulse.source, buttonPresses);
      }
    }
  };

  for (buttonPresses = 1; buttonPresses <= 10000; buttonPresses++) {
    performOneFullPulsePropagation(broadcaster, onPulseCallback);

    // when we got at least one HIGH from all input modules, that's enough
    if (whenDoInputModulesGiveHigh.size === moduleBeforeRx.inputModules.size)
      break;
  }

  // and, assuming cyclic operation, let's have the smallest common multiple... or just the multiple of the first occurrences
  return [...whenDoInputModulesGiveHigh.values()].reduce(
    (acc, num) => acc * num
  );
};

const HIGH = true;
