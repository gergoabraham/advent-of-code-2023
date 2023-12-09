module.exports = (input) => {
  return input
    .split("\n")
    .filter((x) => x)
    .map((line) => line.split("").filter((x) => isFinite(x)))
    .map((nums) => 10 * +nums[0] + +nums[nums.length - 1])
    .reduce((acc, num) => acc + num);
};
