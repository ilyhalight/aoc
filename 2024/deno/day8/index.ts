import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const baseLines = input.replaceAll("\r", "").split("\n");

const height = baseLines.length;
const width = baseLines[0].length;

const antennes = new Map();

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const symbol = baseLines[y][x];
    if (symbol === "." || symbol === "#") {
      continue;
    }

    const pos = [x, y];
    if (antennes.has(symbol)) {
      const oldValue = antennes.get(symbol);
      antennes.set(symbol, [...oldValue, pos]);
      continue;
    }

    antennes.set(symbol, [pos]);
  }
}

const calcAntinodes = (antinodes: Set<string>) => {
  for (const [_, val] of antennes.entries()) {
    for (let i = 0; i < val.length; i++) {
      const pos = val[i];
      const [posX, posY] = pos;
      for (let k = 0; k < val.length; k++) {
        if (i === k) {
          continue;
        }

        const nextPos = val[k];
        const [nextPosX, nextPosY] = nextPos;
        const offsetX = nextPosX - posX;
        const offsetY = nextPosY - posY;
        const antinodeX = posX - offsetX;
        const antinodeY = posY - offsetY;
        if (
          antinodeX < width &&
          antinodeX > -1 &&
          antinodeY < height &&
          antinodeY > -1
        ) {
          antinodes.add(`${antinodeX}:${antinodeY}`);
        }

        const antinodeNextX = nextPosX + offsetX;
        const antinodeNextY = nextPosY + offsetY;
        if (
          antinodeNextX < width &&
          antinodeNextX > -1 &&
          antinodeNextY < height &&
          antinodeNextY > -1
        ) {
          antinodes.add(`${antinodeNextX}:${antinodeNextY}`);
        }
      }
    }
  }
};

const calcAntinodesPartTwo = (antinodes: Set<string>) => {
  for (const [_, val] of antennes.entries()) {
    for (let i = 0; i < val.length; i++) {
      const pos = val[i];
      for (let k = 0; k < val.length; k++) {
        const nextPos = val[k];
        let [posX, posY] = pos;
        let [nextPosX, nextPosY] = nextPos;
        const offsetX = nextPosX - posX;
        const offsetY = nextPosY - posY;
        antinodes.add(`${nextPosX}:${nextPosY}`);

        for (let l = 0; l < width; l++) {
          posX -= offsetX;
          posY -= offsetY;
          if (posX < width && posX > -1 && posY < height && posY > -1) {
            antinodes.add(`${posX}:${posY}`);
          }

          nextPosX += offsetX;
          nextPosY += offsetY;
          if (
            nextPosX < width &&
            nextPosX > -1 &&
            nextPosY < height &&
            nextPosY > -1
          ) {
            antinodes.add(`${nextPosX}:${nextPosY}`);
          }
        }
      }
    }
  }
};

const antinodesPartOne = new Set<string>();
calcAntinodes(antinodesPartOne);

const antinodesPartTwo = new Set<string>();
calcAntinodesPartTwo(antinodesPartTwo);

// let nodeMap = baseLines.map((v) => v.split(""));
// for (const antinode of antinodes) {
//   const [posX, posY] = antinode.split(":").map((v) => +v);
//   nodeMap[posY][posX] = "#";
// }

// console.log(nodeMap.map((v) => v.join("")).join("\n"));

const total = antinodesPartOne.size;
const totalPartTwo = antinodesPartTwo.size;

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
