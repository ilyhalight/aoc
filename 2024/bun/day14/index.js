import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const baseLines = input
  .replaceAll("\r", "")
  .split("\n")
  .map((line) =>
    line.split(" ").map((infoLine) => infoLine.match(/-?\d+/g).map((v) => +v))
  );

const width = 101;
const height = 103;

const middleWidth = Math.floor(width / 2);
const middleHeight = Math.floor(height / 2);

const map = Array.from({ length: height }).fill(
  Array.from({ length: width }).fill(0)
);

const robotCache = new Map();

const waitMove = (robot, seconds) => {
  let [[posX, posY], [velocityX, velocityY]] = robot;
  const [[startPosX, startPosY], [startVelocityX, startVelocityY]] = robot;
  const oldPosKey = `${
    seconds - 1
  },${startPosX},${startPosY},${startVelocityX},${startVelocityY}`;
  let moveSeconds = seconds;
  if (robotCache.has(oldPosKey)) {
    [posX, posY] = robotCache.get(oldPosKey);
    moveSeconds = 1;
  }

  for (let i = 0; i < moveSeconds; i++) {
    posX += velocityX;
    posY += velocityY;
    if (posX >= width) {
      posX -= width;
    }

    if (posX < 0) {
      posX += width;
    }
    if (posY >= height) {
      posY -= height;
    }

    if (posY < 0) {
      posY += height;
    }
  }

  const robotPos = [posX, posY];
  robotCache.set(
    `${seconds},${startPosX},${startPosY},${startVelocityX},${startVelocityY}`,
    robotPos
  );

  return robotPos;
};

const printMap = (robots) => {
  console.log(
    map
      .map((t, y) => {
        return t
          .map((_, x) => {
            const l = robots.filter(
              ([[posX, posY], _]) => posX === x && posY === y
            ).length;
            return l > 0 ? l : ".";
          })
          .join("");
      })
      .join("\n")
  );
};

console.log("Waiting part 1...");

const robotsAfterMove = baseLines.map((robot) => [waitMove(robot, 100)]);

const chunkedMap = map.reduce(
  (result, line, y) => {
    line.map((_, x) => {
      if (x === middleWidth || y === middleHeight) {
        return undefined;
      }

      // const pos = [x, y];
      const robotsCount = robotsAfterMove.filter(
        ([[posX, posY], _]) => posX === x && posY === y
      ).length;

      const offset =
        x > middleWidth ? (y > middleHeight ? 3 : 1) : y > middleHeight ? 2 : 0;
      result[offset] += robotsCount;
    });

    return result;
  },
  [0, 0, 0, 0]
);

const total = chunkedMap[0] * chunkedMap[1] * chunkedMap[2] * chunkedMap[3];

let treeMap = [];
let totalPartTwo = 0;

console.log("Waiting part 2 (It may take about a minute)...");

for (let i = 0; i < width * height; i++) {
  const test = baseLines.map((robot) => waitMove(robot, i));

  const verticalLines = test.map(([aX, aY]) => {
    let len = 1;
    while (aY > 0) {
      const hasRobot = test.find(([bX, bY]) => aX === bX && bY === aY - 1);
      if (!hasRobot) {
        break;
      }

      len++;
      aY -= 1;
    }
    return len;
  });

  const treeLength = Math.max(...verticalLines);
  if (treeLength > 20) {
    console.log(i, treeLength, treeLength / test.length);
    treeMap = test.map((v) => [v]);
    totalPartTwo = i;
    break;
  }
}

if (totalPartTwo > 0) {
  console.log(
    "================================================================"
  );

  printMap(treeMap);
}

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
