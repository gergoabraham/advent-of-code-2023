/**
 * @param {string} input
 */
module.exports = (input) => {
  const sequence = input.split(",");

  const hashes = sequence.map(toHash);

  return hashes.reduce((sum, num) => sum + num);
};

const toHash = (str) => {
  let hash = 0;

  for (const c of str) {
    hash += c.charCodeAt(0);
    hash *= 17;
    hash %= 256;
  }

  return hash;
};

module.exports.toHash = toHash;
