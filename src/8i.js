/**
 * @param {string} input
 */
module.exports = (input) => {
  const [directions, nodesRaw] = input.split("\n\n");
  const graph = buildGraph(nodesRaw);

  const startNode = graph.get("AAA");
  const targetCondition = (node) => node === graph.get("ZZZ");

  const numberOfSteps = performSteps(startNode, targetCondition, directions);

  return numberOfSteps;
};

class Node {
  constructor(id, L = null, R = null) {
    this.id = id;
    this.L = L;
    this.R = R;
  }
}

const buildGraph = (nodesRaw) => {
  const nodes = new Map();

  nodesRaw.split("\n").forEach((line) => {
    const [, id, idL, idR] = line.match(/(\w{3}) = \((\w{3}), (\w{3})\)/);

    const L = nodes.get(idL) ?? new Node(idL);
    nodes.set(idL, L);

    const R = nodes.get(idR) ?? new Node(idR);
    nodes.set(idR, R);

    const node = nodes.get(id) ?? new Node(id);
    node.L = L;
    node.R = R;
    nodes.set(id, node);
  });

  return nodes;
};

const performSteps = (startNode, targetCondition, directions) => {
  let step = 0;
  let currentNode = startNode;

  do {
    const direction = directions[step % directions.length];
    currentNode = currentNode[direction];

    step++;
  } while (!targetCondition(currentNode));

  return step;
};

module.exports.buildGraph = buildGraph;
module.exports.performSteps = performSteps;
