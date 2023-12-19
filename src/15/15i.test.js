const solver = require("./15i");

const input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

it("15i", () => {
  solver(input).should.equal(1320);
});
