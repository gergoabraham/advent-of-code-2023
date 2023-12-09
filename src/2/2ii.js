const { parseGames } = require("./2i");

module.exports = (input) => {
  const games = parseGames(input);

  const minimumCubes = games.map((game) =>
    game.rounds.reduce(
      (minCubes, round) => ({
        red: Math.max(minCubes.red, round.red),
        green: Math.max(minCubes.green, round.green),
        blue: Math.max(minCubes.blue, round.blue),
      }),
      { red: 0, green: 0, blue: 0 }
    )
  );

  return minimumCubes
    .map(({ red, green, blue }) => red * green * blue)
    .reduce((sum, num) => sum + num);
};
