const solver = require("./6ii");

const input = `Time:      7  15   30
Distance:  9  40  200`;

it("6ii", () => {
  solver(input).should.equal(71503);
});
