const { parseRulesets, applyRulesetsOnSeed } = require("./5i");

module.exports = (input) => {
  const seedRanges = input
    .split("\n")[0]
    .match(/\d+/g)
    .map((x) => +x);

  const rulesets = parseRulesets(input);
  const applyRulesets = applyRulesetsOnSeed(rulesets);

  // haha, brute force solution, it took 6 minutes to run {´◕ ◡ ◕｀}
  let minLocation = Infinity;
  for (let i = 0; i < seedRanges.length; i += 2) {
    const start = seedRanges[i];
    const range = seedRanges[i + 1];

    console.log(`for range ${i / 2 + 1} of ${seedRanges.length / 2}`);

    for (let seed = start; seed < start + range - 1; seed++) {
      minLocation = Math.min(minLocation, applyRulesets(seed));
    }
  }

  return minLocation;
};
