const solver = require("./6i");

const input = `Time:      7  15   30
Distance:  9  40  200`;

it("6i", () => {
  solver(input).should.equal(288);
});
