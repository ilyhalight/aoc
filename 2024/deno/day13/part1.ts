import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const baseLines = input
  .replaceAll("\r", "")
  .split("\n\n")
  .map((line) =>
    line.split("\n").map((infoLine) => infoLine.match(/\d+/g)!.map((v) => +v))
  );

function getMinimalPrice(lines: number[][][], maxPresses = 100) {
  let minimalPrice = 0;
  for (let i = 0; i < lines.length; i++) {
    const [[aX, aY], [bX, bY], [prizeX, prizeY]] = lines[i];
    const variants = [];
    for (let a = 0; a < maxPresses; a++) {
      const resAx = aX * a;
      const resAy = aY * a;
      for (let b = 0; b < maxPresses; b++) {
        const resBx = bX * b;
        const resBy = bY * b;
        if (resAx + resBx === prizeX && resAy + resBy === prizeY) {
          variants.push([a, b]);
          break;
        }

        if (resBx === prizeX && resBy === prizeY) {
          variants.push([0, b]);
        }
      }

      if (resAx === prizeX && resAy === prizeY) {
        variants.push([a, 0]);
      }
    }

    const bestVariant = variants.find(([countA, countB]) =>
      Math.min(countA * 3 + countB)
    );

    if (!bestVariant) {
      continue;
    }

    minimalPrice += bestVariant[0] * 3 + bestVariant[1];
  }

  return minimalPrice;
}

const total = getMinimalPrice(baseLines, 100);
// const totalPartTwo = getMinimalPrice(linesForPartTwo, posOffset);
const totalPartTwo = 0;

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
