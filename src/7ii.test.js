const solver = require("./7ii");
const puzzleInput = require("../inputs/7");

const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

it("7ii", () => {
  solver(input).should.equal(5905);
  solver(puzzleInput).should.equal(250506580);
});
