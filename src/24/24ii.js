/**
 * @param {string} input

the position where hailstone A (starting from xA0, yA0, zA0) meets the rock (starting from x0, y0, z0)
xA0 + tA*dxA = x0 + tA*dx
yA0 + tA*dyA = y0 + tA*dy
zA0 + tA*dzA = z0 + tA*dz

extract tA from first and second equation
tA = -(xA0 - x0)/(dxA - dx)
tA = -(yA0 - y0)/(dyA - dy)

make them equal, and multiply by -1
(xA0 - x0)/(dxA - dx) = (yA0 - y0)/(dyA - dy)

multiply with the denominators
(xA0 - x0)*(dyA - dy) = (yA0 - y0)*(dxA - dx)

extract the multiplications
xA0*dyA - xA0*dy - x0*dyA + x0*dy = yA0*dxA - yA0*dx - y0*dxA + y0*dx

move the items around, so the left side is independent from hailstone A
x0*dy - y0*dx = yA0*dxA - yA0*dx - y0*dxA - xA0*dyA + xA0*dy + x0*dyA

get same equation for second hailstone
x0*dy - y0*dx = yB0*dxB - yB0*dx - y0*dxB - xB0*dyB + xB0*dy + x0*dyB

make them equal by x0*dy - y0*dx
yA0*dxA - yA0*dx - y0*dxA - xA0*dyA + xA0*dy + x0*dyA = yB0*dxB - yB0*dx - y0*dxB - xB0*dyB + xB0*dy + x0*dyB

reorder
x0*dyA - x0*dyB + yB0*dx - yA0*dx + y0*dxB - y0*dxA + xA0*dy - xB0*dy = xA0*dyA + yB0*dxB - xB0*dyB - yA0*dxA

extract unknowns
(dyA - dyB)*x0 + (yB0 - yA0)*dx + (dxB - dxA)*y0 + (xA0 - xB0)*dy = xA0*dyA + yB0*dxB - xB0*dyB - yA0*dxA

this is a linear equation with 4 unknowns - let's solve it with 4 hailstones
=> solution for x0, dx, y0, dy


and then get z0 by extracting dz from first and second hailstone's position
dz = (zA0 + tA*dzA - z0)/tA
dz = (zB0 + tB*dzB - z0)/tB

make them equal
(zA0 + tA*dzA - z0)/tA = (zB0 + tB*dzB - z0)/tB

multiply by tA, tB
zA0*tB + tA*tB*dzA - z0*tB = tA*zB0 + tA*tB*dzB - z0*tA

reorder
z0*(tA - tB) = tA*zB0 - tB*zA0 + tA*tB*dzB - tA*tB*dzA

divide
z0 = (tA*zB0 - tB*zA0 + tA*tB*(dzB - dzA))/(tA - tB)
 */
module.exports = (input) => {
  const hailstones = parseHailstones(input);

  const matrix = buildMatrixForLinearEquationSystem(hailstones);
  performGaussianElimination(matrix);

  const { y0, x0, dx } = getTheValuesOfUnknowns(matrix);
  const z0 = calculateZ0(hailstones, x0, dx);

  return x0 + y0 + z0;
};

const parseHailstones = (input) =>
  input
    .split("\n")
    .map((line) => line.split(/,? @? ?/))
    .map((data) => {
      const x0 = +data[0];
      const y0 = +data[1];
      const z0 = +data[2];
      const dx = +data[3];
      const dy = +data[4];
      const dz = +data[5];

      return { x0, y0, z0, dx, dy, dz };
    });

const buildMatrixForLinearEquationSystem = (hailstones) => {
  const matrix = [];

  for (let i = 0; i < 4; i++) {
    const A = hailstones[i];
    const B = hailstones[i + 1];

    // the equation for a pair of hailstones:
    // (dyA - dyB)*x0 + (yB0 - yA0)*dx + (dxB - dxA)*y0 + (xA0 - xB0)*dy = xA0*dyA + yB0*dxB - xB0*dyB - yA0*dxA
    matrix.push([
      A.dy - B.dy, // * x0
      B.y0 - A.y0, // * dx
      B.dx - A.dx, // * y0
      A.x0 - B.x0, // * dy

      A.x0 * A.dy + B.y0 * B.dx - B.x0 * B.dy - A.y0 * A.dx, // right side
    ]);
  }
  return matrix;
};

// based on the pseudo code from
// https://en.wikipedia.org/wiki/Gaussian_elimination
const performGaussianElimination = (matrix) => {
  let h = 0;
  let k = 0;

  while (h < 4 && k < 4) {
    let max = matrix[h][k];
    let iMax = h;
    for (let i = h + 1; i < 4; i++) {
      if (abs(matrix[i][k]) > abs(max)) {
        max = matrix[i][k];
        iMax = i;
      }
    }

    if (matrix[iMax][k] === 0) {
      k++;
    } else {
      swapRows(matrix, h, iMax);

      for (let i = h + 1; i < 4; i++) {
        const factor = matrix[i][k] / matrix[h][k];

        matrix[i][k] = 0;

        for (let j = k + 1; j < 5; j++) {
          matrix[i][j] -= matrix[h][j] * factor;
        }
      }

      h++;
      k++;
    }
  }
};

const abs = (num) => (num < 0 ? -num : num);

const swapRows = (matrix, i, j) => {
  const temp = matrix[i];
  matrix[i] = matrix[j];
  matrix[j] = temp;
};

const getTheValuesOfUnknowns = (matrix) => {
  let row = matrix[3];
  const dy = Math.round(row[4] / row[3]);

  row = matrix[2];
  const y0 = Math.round((row[4] - row[3] * dy) / row[2]);

  row = matrix[1];
  const dx = Math.round((row[4] - row[3] * dy - row[2] * y0) / row[1]);

  row = matrix[0];
  const x0 = Math.round(
    (row[4] - row[3] * dy - row[2] * y0 - row[1] * dx) / row[0]
  );

  return { y0, dy, x0, dx };
};

const calculateZ0 = (hailstones, x0, dx) => {
  const A = hailstones[0];
  const B = hailstones[1];

  // tA = -(xA0 - x0)/(dxA - dx)
  const tA = -(A.x0 - x0) / (A.dx - dx);
  const tB = -(B.x0 - x0) / (B.dx - dx);

  // z0 = (tA*zB0 - tB*zA0 + tA*tB*(dzB - dzA))/(tA - tB)
  return (tA * B.z0 - tB * A.z0 + tA * tB * (B.dz - A.dz)) / (tA - tB);
};
