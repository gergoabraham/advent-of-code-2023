/**
 * @param {string} input
 */
module.exports = (input) => {
  const nodesNeighborsMap = buildGraph(input);
  const nodeLabels = [...nodesNeighborsMap.keys()];

  const edgesTraversedFrequency = countEdgesTraversedOnSomeShortestPaths(
    nodesNeighborsMap,
    nodeLabels
  );

  remove3MostVisitedEgdesFromGraph(edgesTraversedFrequency, nodesNeighborsMap);

  const groupASize = countNodesInPartition(nodesNeighborsMap, nodeLabels[0]);
  const groupBSize = nodesNeighborsMap.size - groupASize;

  return groupASize * groupBSize;
};

const buildGraph = (input) => {
  const parsedInput = input.split("\n").map((line) => {
    const [label, connections] = line.split(": ");

    return [label, connections.split(" ")];
  });

  const nodesNeighborsMap = new Map();

  parsedInput.map(([label, connections]) => {
    const neighbors = nodesNeighborsMap.get(label) ?? [];
    nodesNeighborsMap.set(label, neighbors);

    connections.map((connLabel) => {
      const connectedNode = nodesNeighborsMap.get(connLabel) ?? [];
      nodesNeighborsMap.set(connLabel, connectedNode);

      neighbors.push(connLabel);
      connectedNode.push(label);
    });
  });

  return nodesNeighborsMap;
};

const countEdgesTraversedOnSomeShortestPaths = (
  nodesNeighborsMap,
  nodeLabels
) => {
  const edgesTraversedFrequency = new Map();

  const N = Math.min(nodesNeighborsMap.size, 40);

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i === j) continue;

      const A = nodeLabels[i];
      const B = nodeLabels[j];
      findEdgesOnShortestPaths(
        A,
        B,
        nodesNeighborsMap,
        edgesTraversedFrequency
      );
    }
  }
  return edgesTraversedFrequency;
};

const findEdgesOnShortestPaths = (A, B, nodes, edges) => {
  const visited = new Set();
  visited.add(A);
  visited.add(B);

  const queue = [[A, [A]]];
  let hasFoundShortestPaths = false;

  while (queue.length > 0 && !hasFoundShortestPaths) {
    for (let i = queue.length; i > 0; i--) {
      const [node, path] = queue.shift();
      const neighbors = nodes.get(node);

      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          const newPath = [...path, neighbor];
          queue.push([neighbor, newPath]);
          visited.add(neighbor);
        }

        if (neighbor === B) {
          const fullPath = [...path, neighbor];

          for (let j = 0; j < fullPath.length - 1; j++) {
            const fromTo = [fullPath[j], fullPath[j + 1]];
            fromTo.sort();

            const edge = `${fromTo[0]}-${fromTo[1]}`;
            edges.set(edge, (edges.get(edge) ?? 0) + 1);
          }
          hasFoundShortestPaths = true;
        }
      });
    }
  }
};

const countNodesInPartition = (nodes, start) => {
  const visited = new Set();

  const queue = [start];
  visited.add(start);

  while (queue.length) {
    const nodeLabel = queue.shift();
    const node = nodes.get(nodeLabel);

    node.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    });
  }

  return visited.size;
};

const remove3MostVisitedEgdesFromGraph = (
  edgesTraversedFrequency,
  nodesNeighborsMap
) => {
  const edgesFreqArray = [...edgesTraversedFrequency.entries()];
  edgesFreqArray.sort((a, b) => b[1] - a[1]);

  // cut!
  for (const [cut] of edgesFreqArray.slice(0, 3)) {
    const [ALabel, BLabel] = cut.split("-");
    const A = nodesNeighborsMap.get(ALabel);
    const B = nodesNeighborsMap.get(BLabel);

    A.splice(
      A.findIndex((label) => label === BLabel),
      1
    );
    B.splice(
      B.findIndex((label) => label === ALabel),
      1
    );
  }
};
