import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const baseLines = input
  .replaceAll("\r", "")
  .split("\n")
  .map((v) => v.split("").map((v) => +v));

const goToNext = (nearbyLines, startPoint) => {
  const {
    pos: [startX, startY],
    value: { upper, left, current, right, bottom },
  } = startPoint;
  const path = [];
  if (current === 9) {
    path.push(`${startX},${startY}`);
    return path;
  }

  const nextValue = current + 1;
  if (upper === nextValue) {
    const next = nearbyLines[startY - 1][startX];
    path.push(
      ...goToNext(nearbyLines, { pos: [startX, startY - 1], value: next })
    );
  }

  if (left === nextValue) {
    const next = nearbyLines[startY][startX - 1];
    path.push(
      ...goToNext(nearbyLines, { pos: [startX - 1, startY], value: next })
    );
  }

  if (right === nextValue) {
    const next = nearbyLines[startY][startX + 1];
    path.push(
      ...goToNext(nearbyLines, { pos: [startX + 1, startY], value: next })
    );
  }

  if (bottom === nextValue) {
    const next = nearbyLines[startY + 1][startX];
    path.push(
      ...goToNext(nearbyLines, { pos: [startX, startY + 1], value: next })
    );
  }

  return path;
};

const nearby = baseLines.reduce((result, line, y) => {
  const lineValues = [];
  for (let x = 0; x < line.length; x++) {
    const upper = y > 0 ? baseLines[y - 1][x] : undefined;
    const left = x > 0 ? line[x - 1] : undefined;
    const current = line[x];
    const right = line[x + 1];
    const bottom = y < baseLines.length - 1 ? baseLines[y + 1][x] : undefined;

    lineValues.push({
      pos: `${x},${y}`,
      upper,
      left,
      current,
      right,
      bottom,
    });
  }

  result.push(lineValues);

  return result;
}, []);

const startPoints = nearby.reduce((result, line, y) => {
  for (let x = 0; x < line.length; x++) {
    const value = line[x];
    if (value.current === 0) {
      result.push({ pos: [x, y], value });
    }
  }

  return result;
}, []);

const calcTrailScore = () => {
  let totalScore = 0;
  let totalRate = 0;
  for (const startPoint of startPoints) {
    const path = goToNext(nearby, startPoint);
    totalScore += new Set(path).size;
    totalRate += path.length;
  }

  return [totalScore, totalRate];
};

const [total, totalPartTwo] = calcTrailScore();

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
