import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const [startMap, moveLines] = input
  .replaceAll("\r", "")
  .split("\n\n")
  .map((part) => part.split("\n").map((line) => line.split("")));

const moves = moveLines.flat();
let [posX, posY] = startMap.reduce(
  (result, line, idx) => {
    const startPosX = line.indexOf("@");
    if (startPosX !== -1) {
      result = [startPosX, idx];
      line[startPosX] = ".";
    }

    return result;
  },
  [0, 0]
);

const findBySymbol = (symbol: string): number[][] => {
  const elements = [];
  if (["^", "v"].includes(symbol)) {
    for (
      let y = posY;
      y > -1 && y < startMap.length;
      symbol === "^" ? y-- : y++
    ) {
      if (y === posY) {
        continue;
      }

      const el = startMap[y][posX];
      switch (el) {
        case "#":
          return [];
        case "O": {
          elements.push([posX, y]);
          break;
        }
        case ".": {
          elements.push([posX, y]);
          return elements;
        }
      }
    }
  }

  const line = startMap[posY];
  for (let x = posX; x > -1 && x < line.length; symbol === "<" ? x-- : x++) {
    if (x === posX) {
      continue;
    }

    const el = line[x];
    switch (el) {
      case "#":
        return [];
      case "O": {
        elements.push([x, posY]);
        break;
      }
      case ".": {
        elements.push([x, posY]);
        return elements;
      }
    }
  }

  return elements;
};

for (const move of moves) {
  // console.log(move);
  const positions = findBySymbol(move);
  if (!positions.length) {
    continue;
  }

  [[posX, posY]] = positions;
  if (positions.length === 1) {
    continue;
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const [x, y] = positions[i];
    const [prevX, prevY] = positions[i - 1];
    startMap[y][x] = startMap[prevY][prevX];
    startMap[prevY][prevX] = ".";
  }
}

startMap[posY][posX] = "@";

const total = startMap.reduce((total, line, y) => {
  const lineSum = line.reduce((sum, symbol, x) => {
    if (symbol === "O") {
      sum += 100 * y + x;
    }

    return sum;
  }, 0);

  return total + lineSum;
}, 0);

console.log(`Part 1: ${total}`);
