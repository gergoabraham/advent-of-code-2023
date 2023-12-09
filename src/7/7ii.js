const {
  parseGames,
  calculateTotalWins,
  HAND_TYPES,
  calculateCardsFrequencyMap,
  calculateHandStrength,
} = require("./7i");

const CARD_STRENGTHS_WITH_JOKER = {
  J: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  Q: 11,
  K: 12,
  A: 13,
};

/**
 * @param {string} input
 */
module.exports = (input) => {
  const games = parseGames(input);

  const gamesWithStrength = games.map(({ hand, bid }) => {
    const type = calculateHandTypeWithJoker(hand);
    const handStrength = calculateHandStrength(
      type,
      hand,
      CARD_STRENGTHS_WITH_JOKER
    );

    return { hand, bid, type, handStrength };
  });

  gamesWithStrength.sort((a, b) => a.handStrength - b.handStrength);

  return calculateTotalWins(gamesWithStrength);
};

function calculateHandTypeWithJoker(hand) {
  const cardsFrequencyMap = calculateCardsFrequencyMap(hand);

  const numberOfJokers = cardsFrequencyMap.J ?? 0;
  delete cardsFrequencyMap.J;

  const cardFrequencies = Object.values(cardsFrequencyMap);
  cardFrequencies.sort((a, b) => b - a);

  cardFrequencies[0] = (cardFrequencies[0] ?? 0) + numberOfJokers;

  return HAND_TYPES[cardFrequencies.join("")];
}
