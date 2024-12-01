import { getFile } from "../../../utils/bun/utils";

const input = await getFile(import.meta);

const [left, right] = input
  .split("\n")
  .reduce(
    ([left, right], value) => {
      const [leftValue, rightValue] = value.split("   ");

      return [
        [...left, +leftValue],
        [...right, +rightValue],
      ];
    },
    [[], []]
  )
  .map((pairs) => pairs.sort());

const totalDistance = left.reduce(
  (total, current, idx) => (total += Math.abs(current - right[idx])),
  0
);

const similarityScore = left.reduce(
  (total, current) =>
    (total += current * right.filter((val) => val === current).length),
  0
);

console.log(`Part 1: ${totalDistance}`);
console.log(`Part 2: ${similarityScore}`);
