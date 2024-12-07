import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const baseLines = input
  .replaceAll("\r", "")
  .split("\n")
  .map((line) => line.split(""));

let [posX, posY] = baseLines.reduce(
  (result, line, idx) => {
    const guardPosX = line.indexOf("^");
    if (guardPosX !== -1) {
      result = [guardPosX, idx];
      line[guardPosX] = "X";
    }

    return result;
  },
  [0, 0]
);

const copyBaseLines = () => {
  return JSON.parse(JSON.stringify(baseLines));
};

let direction = "top";
const [startX, startY] = [posX, posY];
const width = baseLines[0].length;
const height = baseLines.length;
const partOneLines = copyBaseLines();

const nextDirectionObj = {
  top: "right",
  right: "bottom",
  bottom: "left",
  left: "top",
};

const nextPosOffsetObj = {
  top: [0, -1],
  bottom: [0, 1],
  right: [1, 0],
  left: [-1, 0],
};

const passed = new Set();

const getNextPos = (posLines, paths, counter = 0) => {
  const [offsetX, offsetY] = nextPosOffsetObj[direction];
  const nextX = posX + offsetX;
  const nextY = posY + offsetY;
  if (!checkPosExists(nextX, nextY) || counter > 3) {
    paths.add(`${direction}:${posX}:${posY}`);
    return [nextX, nextY];
  }

  const target = posLines[nextY][nextX];
  if (target === "#") {
    direction = nextDirectionObj[direction];
    counter++;
    return getNextPos(posLines, paths, counter);
  }

  paths.add(`${direction}:${posX}:${posY}`);
  posLines[nextY][nextX] = "X";
  return [nextX, nextY];
};

const checkPosExists = (x, y) => x >= 0 && x < width && y >= 0 && y < height;

console.log("Waiting part 1...");
do {
  [posX, posY] = getNextPos(partOneLines, passed);
} while (checkPosExists(posX, posY));

const partOneMap = partOneLines.map((line) => line.join("")).join("\n");
// console.log(partOneMap)
const total = partOneMap.match(/X/g).length;

console.log("Waiting part 2 (It can take quite a long time)...");

const availableBlocks = new Set();

const availabledPaths = partOneLines
  .map((line, y) => {
    return line
      .map((s, x) => {
        if (s === "X") {
          return [x, y];
        }

        return null;
      })
      .filter((line) => line);
  })
  .flat();

for (const availabledPath of availabledPaths) {
  const [x, y] = availabledPath;
  if (x === startX && y === startY) {
    continue;
  }

  direction = "top";
  posX = startX;
  posY = startY;
  const fakeLines = copyBaseLines();
  fakeLines[y][x] = "#";
  const visited = new Set();
  const pathValidator = {};
  do {
    const key = `${direction}:${posX}:${posY}`;
    if (visited.has(key)) {
      availableBlocks.add(`${x}:${y}`);
      break;
    }

    if (key in pathValidator && pathValidator[key] > 4) {
      visited.add(key);
    }

    [posX, posY] = getNextPos(fakeLines, visited);
    pathValidator[key] = key in pathValidator ? pathValidator[key] + 1 : 1;
  } while (checkPosExists(posX, posY));

  console.log(availableBlocks.size, "/", availabledPaths.length);
}

const totalPartTwo = availableBlocks.size;

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
