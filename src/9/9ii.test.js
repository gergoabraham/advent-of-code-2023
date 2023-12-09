const solver = require("./9ii");

const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

it("9ii", () => {
  solver(input).should.equal(2);
});
