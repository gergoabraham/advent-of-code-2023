const solver = require("./9i");

const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

it("9i", () => {
  solver(input).should.equal(114);
});
