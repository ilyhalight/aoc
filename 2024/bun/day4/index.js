import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const lines = input
  .replaceAll("\r", "")
  .split("\n")
  .map((line) => line.split(""));

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
  const calcDiagonal = (startY, startX, deltaY, deltaX) => {
    let line = "";

    for (
      let y = startY, x = startX;
      y < height && y >= 0 && x < width && x >= 0;
      y += deltaY, x += deltaX
    ) {
      line += lines[y][x];
    }

    diagonals.push(line);
  };

  for (let x = 0; x < width; x++) {
    calcDiagonal(0, x, 1, 1);
  }

  for (let y = 1; y < height; y++) {
    calcDiagonal(y, 0, 1, 1);
  }

  for (let x = width - 1; x >= 0; x--) {
    calcDiagonal(0, x, 1, -1);
  }

  for (let y = 1; y < height; y++) {
    calcDiagonal(y, width - 1, 1, -1);
  }

  return diagonals;
};

const match = (line, re) => {
  return line.match(re) ?? [];
};

const calcXMASIncludes = (total, line) => {
  const matches = match(line, /(?=XMAS)|(?=SAMX)/g);
  return total + matches.length;
};

const calcMASIncludes = (line) => {
  return match(line, /(?=MAS)|(?=SAM)/g).length === 2;
};

const checkX = (x, y) => {
  const finalLine =
    lines[x - 1][y - 1] +
    lines[x][y] +
    lines[x + 1][y + 1] +
    lines[x + 1][y - 1] +
    lines[x][y] +
    lines[x - 1][y + 1];
  return Number(calcMASIncludes(finalLine));
};

const diagonals = findDiagonals();
const totalFromDiagonals = diagonals.reduce(calcXMASIncludes, 0);
const total = lines.reduce((result, line, idx) => {
  const count = findDirections(line, idx).reduce(calcXMASIncludes, 0);

  return result + count;
}, totalFromDiagonals);

let totalPartTwo = 0;

for (let i = 1; i < width - 1; i++) {
  for (let j = 1; j < height - 1; j++) {
    totalPartTwo += checkX(i, j);
  }
}

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
