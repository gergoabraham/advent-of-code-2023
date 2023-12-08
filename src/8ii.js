const { buildGraph, performSteps } = require("./8i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const [directions, nodesRaw] = input.split("\n\n");
  const graph = buildGraph(nodesRaw);

  const targetCondition = (node) => node.id.match(/..Z/);
  const startNodes = [...graph.keys()]
    .filter((key) => key.match(/..A/))
    .map((key) => graph.get(key));

  const numbersOfSteps = startNodes.map((startNode) =>
    performSteps(startNode, targetCondition, directions)
  );

  return numbersOfSteps.reduce((acc, num) => lcm(num, acc));
};

const gcd = (a, b) => {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
};

const lcm = (a, b) => (a * b) / gcd(a, b);
