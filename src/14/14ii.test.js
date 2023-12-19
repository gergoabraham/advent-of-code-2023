const solver = require("./14ii");

const input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

it("14ii", () => {
  solver(input).should.equal(64);
});
