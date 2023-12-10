const solver = require("./10i");

const input1 = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;

const input2 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

it("10i 1", () => {
  solver(input1).should.equal(4);
});

it("10i 2", () => {
  solver(input2).should.equal(8);
});
