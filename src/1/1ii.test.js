const solver = require("./1ii");

const input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

it("1ii", () => {
  solver(input).should.equal(281);
});
