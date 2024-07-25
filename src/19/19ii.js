/**
 * @param {string} input
 */
module.exports = (input) => {
  const workflowsRaw = input.split("\n\n").map((line) => line.split("\n"))[0];
  const workflows = parseWorkflows(workflowsRaw);

  let numberOfAcceptedParts = 0;

  const dfs = (
    workflow = "in",
    index = 0,
    range = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }
  ) => {
    if (workflow === "A") {
      numberOfAcceptedParts += getNumberOfCombinations(range);
      return;
    }
    if (workflow === "R") {
      return;
    }

    const step = workflows[workflow][index];
    if (step.operator) {
      const { param, operator, value, workflowOnTrue } = step;
      const { rangeOnTrue, rangeOnFalse } = splitRange(
        range,
        operator,
        param,
        value
      );

      if (isRangeValid(rangeOnTrue, param)) {
        dfs(workflowOnTrue, 0, rangeOnTrue);
      }

      if (isRangeValid(rangeOnFalse, param)) {
        dfs(workflow, index + 1, rangeOnFalse);
      }
    } else {
      dfs(step.workflowOnTrue, 0, range);
    }
  };

  dfs();

  return numberOfAcceptedParts;
};

const parseWorkflows = (workflowsRaw) => {
  const WORKFLOW_PATTERN = /([xmas])([<>])(\d+):(\w+)/;

  return workflowsRaw.reduce((acc, line) => {
    const [, name, steps] = line.match(/(\w+)\{(.+)\}/);
    const stepsRaw = steps.split(",");

    acc[name] = stepsRaw.map((step) => {
      if (WORKFLOW_PATTERN.test(step)) {
        const [, param, operator, value, workflowOnTrue] =
          WORKFLOW_PATTERN.exec(step);

        return { param, operator, value: +value, workflowOnTrue };
      } else {
        return { workflowOnTrue: step };
      }
    });

    return acc;
  }, {});
};

const isRangeValid = (rangeOnTrue, param) =>
  rangeOnTrue[param][0] <= rangeOnTrue[param][1];

const getNumberOfCombinations = (range) =>
  Object.values(range)
    .map(([min, max]) => max - min + 1)
    .reduce((acc, num) => acc * num);

const splitRange = (range, operator, param, value) => {
  const rangeOnTrue = { ...range };
  const rangeOnFalse = { ...range };

  if (operator === ">") {
    rangeOnTrue[param] = [value + 1, rangeOnTrue[param][1]];
    rangeOnFalse[param] = [rangeOnFalse[param][0], value];
  } else {
    rangeOnTrue[param] = [rangeOnTrue[param][0], value - 1];
    rangeOnFalse[param] = [value, rangeOnFalse[param][1]];
  }

  return { rangeOnTrue, rangeOnFalse };
};
