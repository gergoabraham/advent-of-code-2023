const solver = require("./1i");

const input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;

it("1i", () => {
  solver(input).should.equal(142);
});
