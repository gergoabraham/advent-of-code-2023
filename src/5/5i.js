/**
 * @param {string} input
 */
module.exports = (input) => {
  const seeds = input
    .split("\n")[0]
    .match(/\d+/g)
    .map((x) => +x);
  const rulesets = parseRulesets(input);

  const locations = seeds.map(applyRulesetsOnSeed(rulesets));

  return Math.min(...locations);
};

const parseRulesets = (input) => {
  return input
    .split(/\n\n.+:\n/g)
    .slice(1)
    .map((ruleset) =>
      ruleset.split("\n").map((rule) => {
        const ruleArray = rule.split(" ");
        const destination = +ruleArray[0];
        const source = +ruleArray[1];
        const range = +ruleArray[2];

        return {
          min: source,
          max: source + range - 1,
          offset: destination - source,
        };
      })
    );
};

const applyRulesetsOnSeed = (ruleSets) => (seed) => {
  for (const ruleSet of ruleSets) {
    seed = applyRuleset(seed, ruleSet);
  }
  return seed;
};

const applyRuleset = (prev, ruleSet) => {
  for (const rule of ruleSet) {
    if (prev >= rule.min && prev <= rule.max) {
      return prev + rule.offset;
    }
  }
  return prev;
};

module.exports.applyRulesetsOnSeed = applyRulesetsOnSeed;
module.exports.parseRulesets = parseRulesets;
