import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const lines = input
  .replaceAll("\r", "")
  .split("\n")
  .map((line) => line.split(""));
console.log(lines);

const findDirections = (selectedLine, selectedIdx) => {
  const horizontal = selectedLine.join("");
  const vertical = lines
    .map((line) => line.filter((_, valIdx) => valIdx === selectedIdx).join(""))
    .join("");

  return [horizontal, vertical];
};

const width = lines[0].length;
const height = lines.length;

const findDiagonals = () => {
  const diagonals = [];
  for (let x = 0; x < width; x++) {
    let line = "";

    for (let y = 0, tempX = x; y < height && tempX < width; y++, tempX++) {
      line += lines[y][tempX];
    }

    diagonals.push(line);
  }

  for (let y = 1; y < height; y++) {
    let line = "";

    console.log("=====start 2=====");
    for (let x = 0, tempY = y; x < width && tempY < height; x++, tempY++) {
      console.log(tempY, x);
      line += lines[tempY][x];
    }

    diagonals.push(line);
  }

  for (let x = width - 1; x >= 0; x--) {
    let line = "";

    console.log("=====start 3=====");
    for (let y = 0, tempX = x; y < height && tempX >= 0; y++, tempX--) {
      console.log(tempX, y);
      line += lines[y][tempX];
    }

    diagonals.push(line);
  }

  for (let y = 1; y < height; y++) {
    let line = "";

    for (let x = width - 1, tempY = y; x >= 0 && tempY < height; x--, tempY++) {
      console.log(tempY, x);
      line += lines[tempY][x];
    }

    diagonals.push(line);
  }

  return diagonals;
};

const calcIncludes = (total, line) => {
  const matches = line.match(/(?=XMAS)|(?=SAMX)/g) ?? [];
  return total + matches.length;
};

const diagonals = findDiagonals();
console.log(diagonals);

const totalFromDiagonals = diagonals.reduce(calcIncludes, 0);
console.log(totalFromDiagonals);

const total = lines.reduce((result, line, idx) => {
  const count = findDirections(line, idx).reduce(calcIncludes, 0);

  return result + count;
}, totalFromDiagonals);

console.log(`Part 1: ${total}`);
// console.log(`Part 2: ${totalPartTwo}`);
