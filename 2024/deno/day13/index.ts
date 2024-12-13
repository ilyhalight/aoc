import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const baseLines = input
  .replaceAll("\r", "")
  .split("\n\n")
  .map((line) =>
    line.split("\n").map((infoLine) => infoLine.match(/\d+/g)!.map((v) => +v))
  );

const posOffset = 10000000000000;

const linesForPartTwo = baseLines.map((line) => {
  const [[aX, aY], [bX, bY], [prizeX, prizeY]] = line;
  return [
    [aX, aY],
    [bX, bY],
    [prizeX + posOffset, prizeY + posOffset],
  ];
});

function getMinimalPrice(lines: number[][][]) {
  let minimalPrice = 0;
  for (let i = 0; i < lines.length; i++) {
    const [[aX, aY], [bX, bY], [prizeX, prizeY]] = lines[i];
    const a = (prizeX * bY - prizeY * bX) / (aX * bY - aY * bX);
    const b = (prizeY * aX - prizeX * aY) / (aX * bY - aY * bX);
    if (Number.isInteger(a) && Number.isInteger(b)) {
      minimalPrice += a * 3 + b;
    }
  }

  return minimalPrice;
}

const total = getMinimalPrice(baseLines);
const totalPartTwo = getMinimalPrice(linesForPartTwo);
// const totalPartTwo = 0;

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
