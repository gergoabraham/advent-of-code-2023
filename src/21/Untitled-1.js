/**
 * @param {string} input
 */
module.exports = async (input, steps = 26501365) => {
  const map = input.split("\n").map((line) => line.split(""));

  const SIZE = 13;

  const inputWithoutStart = input.replace("S", ".");
  const createNewMap = () =>
    inputWithoutStart.split("\n").map((line) => line.split(""));

  const sIndex = input.indexOf("S");
  const startCoords = {
    X: Math.floor(SIZE / 2),
    Y: Math.floor(SIZE / 2),
    x: Math.floor(sIndex / map.length),
    y: sIndex % (map[0].length + 1),
  };
  map[startCoords.x][startCoords.y] = ".";

  const maps = new Array(SIZE)
    .fill(0)
    .map(() => new Array(SIZE).fill(0).map(() => createNewMap()));

  const xMax = map.length - 1;
  const yMax = map[0].length - 1;

  // bfs with the trick to remember if a cell is visited in
  // an even or in an odd step, bc that's what matters
  const queue = [startCoords];
  for (let step = 0; step <= steps; step++) {
    const queueLength = queue.length;
    for (let i = queueLength; i > 0; i--) {
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

      let map = maps[X][Y];

      if (map?.[x]?.[y] !== ".") continue;

      map[x][y] = step % 2 ? "o" : "e";

      queue.push({ X, Y, x, y: y - 1 });
      queue.push({ X, Y, x: x - 1, y });
      queue.push({ X, Y, x: x + 1, y });
      queue.push({ X, Y, x, y: y + 1 });
    }

    console.clear();
    console.clear();
    console.log("New cells: ", queueLength, "\n");

    for (let ROW = 0; ROW < maps.length; ROW++) {
      // if (ROW !== 5) continue;

      for (let row = 0; row <= xMax; row++) {
        console.log(maps[ROW].map((map) => map[row].join(" ")).join(" "));
      }
    }

    await new Promise((r) => setTimeout(r, 150));
  }

  const characterToSearch = steps % 0 ? "o" : "e";
  return maps
    .flat(3)
    .reduce((sum, cell) => sum + (cell === characterToSearch ? 1 : 0), 0);
};

// otlet: csinalj meg size * 2 + lepes % size lepest -> eredmeny:
//     X
//    XXX
//   XXXXX
//    XXX
//     X
// ha barmelyik belsoben van ures, akkor meg egyet, addig, amig a belso legalabb 5 map telitett
// aztan fel lehet szorozni: a belsoket + az "ivet"
