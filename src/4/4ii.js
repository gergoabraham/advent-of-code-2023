const { parseCards, getMatchesPerCard } = require("./4i");

module.exports = (input) => {
  const cards = parseCards(input);
  const matchesPerCards = getMatchesPerCard(cards);

  const numberOfInstances = new Array(cards.length).fill(1);

  for (let i = 0; i < matchesPerCards.length; i++) {
    for (let j = 0; j < matchesPerCards[i]; j++) {
      numberOfInstances[i + j + 1] += numberOfInstances[i];
    }
  }

  return numberOfInstances.reduce((sum, num) => sum + num);
};
