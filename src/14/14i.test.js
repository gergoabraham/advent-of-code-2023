const solver = require("./14i");

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

it("14i", () => {
  solver(input).should.equal(136);
});
