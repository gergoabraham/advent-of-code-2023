const solver = require("./16ii");

const input = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

it("16ii", () => {
  solver(input).should.equal(51);
});
