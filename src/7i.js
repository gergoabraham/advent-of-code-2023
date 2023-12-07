const CARD_STRENGTHS_NO_JOKER = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

const BASE = 14;

const HAND_TYPES = {
  5: "fiveOfAKind",
  41: "fourOfAKind",
  32: "fullHouse",
  311: "threeOfAKind",
  221: "twoPair",
  2111: "onePair",
  11111: "highCard",
};

const TYPE_BASE_STRENGTH = {
  fiveOfAKind: 6,
  fourOfAKind: 5,
  fullHouse: 4,
  threeOfAKind: 3,
  twoPair: 2,
  onePair: 1,
  highCard: 0,
};

/**
 * @param {string} input
 */
module.exports = (input) => {
  const games = parseGames(input);

  const gamesWithStrength = games.map(({ hand, bid }) => {
    const type = calculateHandTypeNoJoker(hand);
    const handStrength = calculateHandStrength(
      type,
      hand,
      CARD_STRENGTHS_NO_JOKER
    );

    return { hand, bid, type, handStrength };
  });

  gamesWithStrength.sort((a, b) => a.handStrength - b.handStrength);

  return calculateTotalWins(gamesWithStrength);
};

const calculateHandTypeNoJoker = (hand) => {
  const cardsFrequencyMap = calculateCardsFrequencyMap(hand);

  const cardFrequencies = Object.values(cardsFrequencyMap);
  cardFrequencies.sort((a, b) => b - a);

  return HAND_TYPES[cardFrequencies.join("")];
};

const calculateHandStrength = (type, hand, CARD_STRENGTHS) => {
  let handStrength = TYPE_BASE_STRENGTH[type];
  for (const c of hand) {
    handStrength = BASE * handStrength + CARD_STRENGTHS[c];
  }
  return handStrength;
};

const calculateCardsFrequencyMap = (hand) => {
  const cardsFrequencyMap = {};
  for (const c of hand) {
    cardsFrequencyMap[c] = (cardsFrequencyMap[c] ?? 0) + 1;
  }
  return cardsFrequencyMap;
};

const calculateTotalWins = (gamesWithStrength) => {
  const wins = gamesWithStrength.map(({ bid }, i) => {
    const rank = i + 1;
    const win = bid * rank;

    return win;
  });

  return wins.reduce((acc, win) => acc + win);
};

const parseGames = (input) => {
  return input
    .split("\n")
    .map((line) => line.split(" "))
    .map(([hand, bid]) => ({ hand, bid }));
};

module.exports.parseGames = parseGames;
module.exports.calculateTotalWins = calculateTotalWins;
module.exports.HAND_TYPES = HAND_TYPES;
module.exports.calculateCardsFrequencyMap = calculateCardsFrequencyMap;
module.exports.calculateHandStrength = calculateHandStrength;
