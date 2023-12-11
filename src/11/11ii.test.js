const { calculateAllGalaxyDistances } = require("./11i");

const input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

it("11ii", () => {
  calculateAllGalaxyDistances(input, 10).should.equal(1030);
  calculateAllGalaxyDistances(input, 100).should.equal(8410);
});