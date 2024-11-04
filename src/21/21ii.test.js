const solver = require("./21ii");

const emptyInput = `...........
...........
...........
...........
...........
.....S.....
...........
...........
...........
...........
...........`;

const exampleInput = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

describe("21ii", () => {
  describe("empty field - to be able to sum up tiles", () => {
    for (const steps of [
      5, 6, 10, 20, 20, 30, 31, 32, 33, 34, 35, 36, 37, 42, 49, 50, 60, 61, 71,
      72, 1400, 50000, 26501365, 50,
    ]) {
      it(`for ${steps} steps`, async () => {
        (await solver(emptyInput, steps)).should.equal((steps + 1) ** 2);
      });
    }
  });

  describe("example", () => {
    for (const [steps, result] of [
      [6, 16],
      [36, 784],
      [50, 1594],
      [100, 6536],
      [140, 13023],
      [500, 167004],
      [1000, 668697],
      [5000, 16733044],
    ]) {
      it(`for ${steps} steps`, async () => {
        (await solver(exampleInput, steps)).should.equal(result);
      });
    }
  });
});
