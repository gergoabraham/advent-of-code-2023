module.exports = (input) => {
  const games = parseGames(input);

  const maxes = { red: 12, green: 13, blue: 14 };

  const possibleGames = games.filter((game) =>
    game.rounds.reduce((isGamePossible, round) => {
      const isRoundPossible =
        round.red <= maxes.red &&
        round.green <= maxes.green &&
        round.blue <= maxes.blue;

      return isGamePossible && isRoundPossible;
    }, true)
  );

  return possibleGames.reduce((sum, game) => sum + game.id, 0);
};

const parseGames = (input) =>
  input.split("\n").map((line) => ({
    id: Number(line.match(/(?<=Game )\d+/)),
    rounds: line.split(";").map((game) => ({
      red: Number(game.match(/\d+(?= red)/)),
      green: Number(game.match(/\d+(?= green)/)),
      blue: Number(game.match(/\d+(?= blue)/)),
    })),
  }));

module.exports.parseGames = parseGames;
