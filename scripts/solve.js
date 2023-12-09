const problem = process.argv[2];
const day = problem.match(/\d+/);
const solver = require(`../src/${day}/${problem}.js`);
const input = require(`../src/${day}/${day}.input.js`);

console.log(solver(input));
