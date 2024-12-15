import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);
let [startMap, moveLines] = input
  .replaceAll("\r", "")
  .split("\n\n")
  .map((part) => part.split("\n").map((line) => line.split("")));

startMap = startMap.map((line) => {
  return line.reduce((result, part) => {
    if (part === "@") {
      result.push(part, ".");
      return result;
    }

    result.push(...(part === "O" ? ["[", "]"] : [part, part]));

    return result;
  }, [] as string[]);
});

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
const findBySymbol = (symbol: string) => {
  const moved = new Map();
  if (["^", "v"].includes(symbol)) {
    let hXes = [posX];
    for (
      let y = posY;
      y > -1 && y < startMap.length;
      symbol === "^" ? y-- : y++
    ) {
      if (y === posY) {
        continue;
      }

      const spaces: number[][] = [];
      for (const hX of hXes) {
        const el = startMap[y][hX];
        const data = [[hX, y]];
        const oldPos = moved.get(hX) ?? [];
        switch (el) {
          case "#":
            return undefined;
          case "[": {
            const xRight = hX + 1;
            if (!hXes.includes(xRight)) {
              hXes.push(xRight);
              data.push([xRight, y]);
            }

            moved.set(hX, [...oldPos, [hX, y]]);
            break;
          }
          case "]": {
            const xLeft = hX - 1;
            if (!hXes.includes(xLeft)) {
              hXes.push(xLeft);
              data.push([xLeft, y]);
            }

            moved.set(hX, [...oldPos, [hX, y]]);
            break;
          }
          case ".": {
            spaces.push([hX, y]);
            moved.set(hX, [...oldPos, [hX, y]]);
            break;
          }
        }
      }

      hXes = hXes.filter((x) => !spaces.find(([sX]) => sX === x));
    }

    return moved;
  }

  const line = startMap[posY];
  for (let x = posX; x > -1 && x < line.length; symbol === "<" ? x-- : x++) {
    if (x === posX) {
      continue;
    }

    const el = line[x];
    const oldPos = moved.get(x) ?? [];
    switch (el) {
      case "#":
        return undefined;
      case "[":
      case "]": {
        moved.set(x, [...oldPos, [x, posY]]);
        break;
      }
      case ".": {
        moved.set(x, [...oldPos, [x, posY]]);
        return moved;
      }
    }
  }
};

const moveOffset = {
  "^": [0, -1],
  v: [0, 1],
  "<": [-1, 0],
  ">": [1, 0],
};

console.log(startMap.map((v) => v.join("")).join("\n"));

for (const move of moves) {
  const positions = findBySymbol(move);
  if (!positions) {
    const testMap = JSON.parse(JSON.stringify(startMap));
    testMap[posY][posX] = "@";
    continue;
  }

  const [offsetX, offsetY] = moveOffset[move as keyof typeof moveOffset];
  posX += offsetX;
  posY += offsetY;

  const movedPositions = Array.from(positions.values());
  const isY = movedPositions.find((pos) => pos.length > 1);
  if (!isY) {
    const lineMoves = movedPositions.flat();
    for (let i = lineMoves.length - 1; i > 0; i--) {
      const [x, y] = lineMoves[i];
      const [prevX, prevY] = lineMoves[i - 1];
      startMap[y][x] = startMap[prevY][prevX];
      startMap[prevY][prevX] = ".";
    }
  } else {
    for (const moved of movedPositions) {
      for (let i = moved.length - 1; i > 0; i--) {
        const [x, y] = moved[i];
        const [prevX, prevY] = moved[i - 1];
        startMap[y][x] = startMap[prevY][prevX];
        startMap[prevY][prevX] = ".";
      }
    }
  }
}

startMap[posY][posX] = "@";
console.log("\n\n" + startMap.map((v) => v.join("")).join("\n"));

const total = startMap.reduce((total, line, y) => {
  const lineSum = line.reduce((sum, symbol, x) => {
    if (symbol === "[") {
      sum += 100 * y + x;
    }

    return sum;
  }, 0);

  return total + lineSum;
}, 0);

console.log(`Part 2: ${total}`);
