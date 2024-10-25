/**
 * @param {string} input
 */
module.exports = (input, steps = 26501365) => {
  const map = input.split("\n").map((line) => line.split(""));
  const gardenPlots = input.split("").filter((x) => x === ".").length + 1;

  const inputWithoutStart = input.replace("S", ".");
  const createNewMap = () => ({
    emptyPlots: gardenPlots,
    isFull: false,
    evens: 0,
    odds: 0,
    map: inputWithoutStart.split("\n").map((line) => line.split("")),
  });

  const sIndex = input.indexOf("S");
  const startCoords = {
    X: steps,
    Y: steps,
    x: Math.floor(sIndex / map.length),
    y: sIndex % (map[0].length + 1),
  };
  map[startCoords.x][startCoords.y] = ".";

  const maps = [];
  maps[steps] = [];
  maps[steps][steps] = createNewMap();

  const xMax = map.length - 1;
  const yMax = map[0].length - 1;

  let XMax = steps;
  let XMin = steps;
  let YMax = steps;
  let YMin = steps;

  const queue = [startCoords];
  const processQueue = (step) => {
    for (let i = queue.length; i > 0; i--) {
      let { X, Y, x, y } = queue.shift();

      // normalize coords
      if (x < 0) {
        X--;
        x = xMax;
      } else if (x > xMax) {
        X++;
        x = 0;
      }
      if (y < 0) {
        Y--;
        y = yMax;
      } else if (y > yMax) {
        Y++;
        y = 0;
      }

      let map = maps[X]?.[Y];
      if (!map) {
        map = createNewMap();
        if (!maps[X]) {
          maps[X] = [];
        }
        maps[X][Y] = map;

        XMax = Math.max(XMax, X);
        XMin = Math.min(XMin, X);
        YMax = Math.max(YMax, Y);
        YMin = Math.min(YMin, Y);
      }

      if (map?.map?.[x]?.[y] !== ".") continue;

      const isOdd = step % 2 === 1;
      map.map[x][y] = isOdd ? "o" : "e";
      if (isOdd) {
        map.odds++;
      } else {
        map.evens++;
      }
      map.emptyPlots--;

      if (map.emptyPlots === 0) {
        map.isFull = true;
      }

      queue.push({ X, Y, x, y: y - 1 });
      queue.push({ X, Y, x: x - 1, y });
      queue.push({ X, Y, x: x + 1, y });
      queue.push({ X, Y, x, y: y + 1 });
    }
  };

  const minStepsToTake =
    Math.floor(map.length / 2) +
    2 * map.length +
    ((steps - Math.floor(map.length / 2)) % map.length);
  let step;
  for (step = 0; step <= minStepsToTake; step++) {
    processQueue(step);
  }
  const areMiddleMapsFull = () =>
    [
      maps[steps][steps],
      maps[steps - 1][steps],
      maps[steps + 1][steps],
      maps[steps][steps - 1],
      maps[steps][steps + 1],
    ]
      .map((map) => map.isFull)
      .every((x) => x);

  while (!areMiddleMapsFull() || step % 2 === steps % 2) {
    const stepsToTake = step + map.length;
    for (; step < stepsToTake; step++) {
      processQueue(step);
    }
  }

  const valueToCount = steps % 2 ? "odds" : "evens";

  let result = 0;

  const centerMapCount = maps[steps][steps][valueToCount];

  const diagonal = Math.ceil((steps - map.length / 2) / map.length) * 2 + 1 - 6;
  const numberOfReachedMaps = (diagonal * (diagonal + 1)) / 2;
  // result += centerMapCount * numberOfReachedMaps;

  console.log(
    "🧀 21ii.js:138 🥭 ",
    JSON.stringify({ numberOfReachedMaps }, null, " ")
  );

  // try to find out for empty fields

  const top = maps[XMin][steps];
  const bottom = maps[XMax][steps];
  const left = maps[steps][YMin];
  const right = maps[steps][YMax];
  result +=
    top[valueToCount] +
    bottom[valueToCount] +
    left[valueToCount] +
    right[valueToCount];

  return result;
};
