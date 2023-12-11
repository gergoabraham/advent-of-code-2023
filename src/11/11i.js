/**
 * @param {string} input
 */
module.exports = (input) => calculateAllGalaxyDistances(input, 2);

const calculateAllGalaxyDistances = (input, ageOfGalaxy) => {
  const { numberOfGalaxies, galaxiesInRows, galaxiesInColumns } =
    analyseGalaxy(input);

  const sumOfVerticalDistances = calculateDistancesIn1Dimension(
    galaxiesInRows,
    numberOfGalaxies,
    ageOfGalaxy
  );
  const sumOfHorizontalDistances = calculateDistancesIn1Dimension(
    galaxiesInColumns,
    numberOfGalaxies,
    ageOfGalaxy
  );

  return sumOfVerticalDistances + sumOfHorizontalDistances;
};

const analyseGalaxy = (input) => {
  const galaxyMap = input.split("\n");

  let numberOfGalaxies = 0;
  const galaxiesInRows = new Array(galaxyMap.length).fill(0);
  const galaxiesInColumns = new Array(galaxyMap[0].length).fill(0);

  for (let row = 0; row < galaxyMap.length; row++) {
    const line = galaxyMap[row];

    for (let col = 0; col < line.length; col++) {
      if (line[col] === "#") {
        galaxiesInRows[row]++;
        galaxiesInColumns[col]++;
        numberOfGalaxies++;
      }
    }
  }

  return { galaxiesInRows, numberOfGalaxies, galaxiesInColumns };
};

const calculateDistancesIn1Dimension = (
  array,
  numberOfGalaxies,
  ageOfGalaxy
) => {
  let galaxiesOnLeft = 0;
  let galaxiesOnRight = numberOfGalaxies;
  let sumOfDistances = 0;

  array.forEach((numberOfGalaxiesInSlot) => {
    const expansionMultiplier = numberOfGalaxiesInSlot === 0 ? ageOfGalaxy : 1;
    sumOfDistances += expansionMultiplier * galaxiesOnLeft * galaxiesOnRight;

    galaxiesOnLeft += numberOfGalaxiesInSlot;
    galaxiesOnRight -= numberOfGalaxiesInSlot;
  });

  return sumOfDistances;
};

module.exports.calculateAllGalaxyDistances = calculateAllGalaxyDistances;
