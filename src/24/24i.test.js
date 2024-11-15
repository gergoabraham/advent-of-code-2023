const solver = require("./24i");

const input = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @ 1, -5, -3`;

it("24i", () => {
  solver(input, 7, 27).should.equal(2);
});
