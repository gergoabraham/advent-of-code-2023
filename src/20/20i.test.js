const solver = require("./20i");

const input1 = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const input2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

describe("20i", () => {
  it("example 1", () => {
    solver(input1).should.equal(32000000);
  });

  it("example 2", () => {
    solver(input2).should.equal(11687500);
  });
});
