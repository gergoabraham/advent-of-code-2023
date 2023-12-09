module.exports = (input) => {
  const cards = parseCards(input);
  const matchesPerCard = getMatchesPerCard(cards);

  const scores = matchesPerCard
    .filter((x) => x)
    .map((matches) => 2 ** (matches - 1));

  return scores.reduce((sum, num) => sum + num);
};

const parseCards = (input) =>
  input.split("\n").map((line) =>
    line
      .split(/[:|]/)
      .slice(1, 3)
      .map((numbers) =>
        numbers
          .trim()
          .split(/ +/)
          .map((x) => Number(x))
      )
  );

const getMatchesPerCard = (cards) =>
  cards.map(([winningNumbers, yourNumbers]) => {
    const winners = new Set(winningNumbers);
    const matches = yourNumbers.filter((yours) => winners.has(yours)).length;
    return matches;
  });

module.exports.parseCards = parseCards;
module.exports.getMatchesPerCard = getMatchesPerCard;
