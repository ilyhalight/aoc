import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

let [startMap, moves] = input
  .replaceAll("\r", "")
  .split("\n\n")
  .map((part) => part.split("\n").map((line) => line.split("")));

moves = moves.flat();
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

const findBySymbol = (symbol) => {
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
};

// console.log(startMap.map((v) => v.join("")).join("\n"));

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

  // console.log(positions);
  for (let i = positions.length - 1; i > 0; i--) {
    // console.log(i);
    const [x, y] = positions[i];
    const [prevX, prevY] = positions[i - 1];
    // console.log(startMap[y][x], startMap[prevY][prevX]);
    startMap[y][x] = startMap[prevY][prevX];
    startMap[prevY][prevX] = ".";
  }

  // console.log("\n\n" + startMap.map((v) => v.join("")).join("\n"));
}

startMap[posY][posX] = "@";
// console.log("\n\n" + startMap.map((v) => v.join("")).join("\n"));

const total = startMap.reduce((total, line, y) => {
  const lineSum = line.reduce((sum, symbol, x) => {
    if (symbol === "O") {
      sum += 100 * y + x;
    }

    return sum;
  }, 0);

  return total + lineSum;
}, 0);

// const total = 0;
// const totalPartTwo = 0;

console.log(`Part 1: ${total}`);
// console.log(`Part 2: ${totalPartTwo}`);
