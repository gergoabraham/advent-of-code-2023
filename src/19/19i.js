/**
 * @param {string} input
 */
module.exports = (input) => {
  const [workflowsRaw, partsRaw] = input
    .split("\n\n")
    .map((line) => line.split("\n"));

  const parts = parseParts(partsRaw);
  const workflows = parseWorkflows(workflowsRaw);

  const acceptedParts = performWorkflows(parts, workflows);

  return [...acceptedParts]
    .map(({ x, m, a, s }) => x + m + a + s)
    .reduce((sum, num) => sum + num);
};

const parseParts = (partsRaw) => {
  const parseParam = (line, param) => Number(line.match(`${param}=(\\d+)`)[1]);

  return partsRaw.map((part) => ({
    x: parseParam(part, "x"),
    m: parseParam(part, "m"),
    a: parseParam(part, "a"),
    s: parseParam(part, "s"),
  }));
};

/**
 * @callback WorkflowStepCallback
 * @param {string} workflow
 * @param {number} index
 * @param {Object} part
 */

/**
 *
 * @param {string[]} workflowsRaw
 * @returns {Object.<string, Array.<WorkflowStepCallback>>}
 */
const parseWorkflows = (workflowsRaw) => {
  const OPERATORS = {
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
  };
  const WORKFLOW_PATTERN = /([xmas])([<>])(\d+):(\w+)/;

  return workflowsRaw.reduce((acc, line) => {
    const [, name, steps] = line.match(/(\w+)\{(.+)\}/);
    const stepsRaw = steps.split(",");

    acc[name] = stepsRaw.map((step) => {
      if (WORKFLOW_PATTERN.test(step)) {
        const [, param, operator, value, onTrue] = WORKFLOW_PATTERN.exec(step);
        const op = OPERATORS[operator];

        return (workflow, index, part) => {
          if (op(part[param], value)) {
            return { workflow: onTrue, index: 0 };
          } else {
            return { workflow, index: index + 1 };
          }
        };
      } else {
        return () => {
          return { workflow: step, index: 0 };
        };
      }
    });

    return acc;
  }, {});
};

const performWorkflows = (parts, workflows) => {
  const acceptedParts = new Set();

  for (const part of parts) {
    let workflow = "in";
    let index = 0;

    while (workflow !== "A" && workflow !== "R") {
      const performStep = workflows[workflow][index];

      ({ workflow, index } = performStep(workflow, index, part));
    }

    if (workflow === "A") {
      acceptedParts.add(part);
    }
  }

  return acceptedParts;
};
