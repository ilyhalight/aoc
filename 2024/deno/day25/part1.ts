import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const schema = input
  .replaceAll("\r", "")
  .split("\n\n")
  .map((item) => item.split("\n"));

const calcHeight = (item: string[]): [maxHeigth: number, columns: number[]] => {
  const columns = [];
  const maxHeight = item.length;
  for (let x = 0; x < item[0].length; x++) {
    let columnHeight = -1;
    for (let y = 0; y < maxHeight; y++) {
      const value = item[y][x];
      if (value === "#") {
        columnHeight++;
      }
    }

    columns.push(columnHeight);
  }

  return [maxHeight - 2, columns];
};

const locks = schema.filter((item) => item[0][0] === "#").map(calcHeight);
const keys = schema.filter((item) => item[0][0] === ".").map(calcHeight);

let total = 0;

for (const key of keys) {
  const [maxHeightKey, [zeroKey, firstKey, secondKey, thirdKey, fourthKey]] =
    key;
  for (const lock of locks) {
    const [
      maxHeightLock,
      [zeroLock, firstLock, secondLock, thirdLock, fourthLock],
    ] = lock;
    if (maxHeightKey !== maxHeightLock) {
      continue;
    }

    if (
      zeroKey + zeroLock > maxHeightLock ||
      firstKey + firstLock > maxHeightLock ||
      secondKey + secondLock > maxHeightLock ||
      thirdKey + thirdLock > maxHeightLock ||
      fourthKey + fourthLock > maxHeightLock
    ) {
      continue;
    }

    total += 1;
  }
}

console.log(`Part 1: ${total}`);
