const { getNewPosition } = require("./18i");

/**
 * @param {string} input
 */
module.exports = (input) => {
  const digPlan = parseDigPlanFromHexa(input);
  const nodes = buildNodes(digPlan);
  return calculateAreaWithModifiedShoelace(nodes);
};

const parseDigPlanFromHexa = (input) => {
  const directions = { 0: "R", 1: "D", 2: "L", 3: "U" };

  return input.split("\n").map((line) => {
    const color = line.match(/\(#(.+)\)/)[1];

    const dist = Number.parseInt(color.slice(0, 5), 16);
    const dir = directions[color[5]];

    return { dist, dir };
  });
};

const buildNodes = (digPlan) => {
  const nodes = new Array(digPlan.length);
  let node = { x: 0, y: 0 };

  for (let i = 0; i < digPlan.length; i++) {
    const { dir, dist } = digPlan[i];
    node = getNewPosition(node, dir, dist);
    nodes[i] = node;
  }

  return nodes;
};

const calculateAreaWithModifiedShoelace = (nodes) => {
  let area = 0;
  for (let i = 0; i < nodes.length; i++) {
    const j = (i + 1) % nodes.length;

    const a = nodes[i];
    const b = nodes[j];

    // shoelace formula
    area += a.x * b.y - a.y * b.x;

    // plus adding the border's area
    area += Math.abs(b.x - a.x + b.y - a.y);
  }

  const iDontKnowWhyImHere = 1;
  return area / 2 + iDontKnowWhyImHere;
};
