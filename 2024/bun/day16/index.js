import { styleText } from "node:util";
import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const baseLines = input
  .replaceAll("\r", "")
  .split("\n")
  .map((line) => line.split(""));

const start = {
  x: 0,
  y: 0,
};

const end = {
  x: 0,
  y: 0,
};

for (const [idx, verticalLine] of Object.entries(baseLines)) {
  const startX = verticalLine.indexOf("S");
  if (startX !== -1) {
    start.x = startX;
    start.y = +idx;
    continue;
  }

  const endX = verticalLine.indexOf("E");
  if (endX !== -1) {
    end.x = endX;
    end.y = +idx;
  }
}

const getDirectionOffset = (direction, newDirection) => {
  if (direction === newDirection) {
    return 0;
  }

  switch (direction) {
    case ">": {
      return newDirection === "<" ? 2000 : 1000;
    }
    case "v": {
      return newDirection === "^" ? 2000 : 1000;
    }
    case "<": {
      return newDirection === ">" ? 2000 : 1000;
    }
    case "^": {
      return newDirection === "v" ? 2000 : 1000;
    }
  }
};

const cached = new Map();

function dijkstra(graph, start, startDirection = ">") {
  const cacheKey = `${start}-${startDirection}`;
  if (cached.has(cacheKey)) {
    return cached.get(cacheKey);
  }

  // const distances = Array(graph.length).fill(Infinity);
  const distances = new Map();
  const visited = new Map();
  const directions = new Map();
  const parents = new Map();

  // const parents = Array(graph.length).fill(-1);
  distances.set(start, 0);
  directions.set(start, startDirection);
  for (let i = 0; i < graph.length; i++) {
    let idx = -1;
    let dist = Infinity;
    for (const [i, distance] of distances.entries()) {
      if (!visited.has(i) && distance < dist) {
        idx = i;
        dist = distance;
      }
    }

    if (idx === -1) {
      break;
    }

    visited.set(idx, true);
    const peak = graph[idx].data;
    for (let j = 0; j < peak.length; j++) {
      const edge = peak[j];
      const weigthOffset = getDirectionOffset(
        directions.get(idx),
        edge.direction
      );

      const newValue =
        (dist === Infinity ? edge.weight : dist + edge.weight) + weigthOffset;
      if ((distances.get(edge.to) ?? Infinity) > newValue) {
        directions.set(edge.to, edge.direction);
        distances.set(edge.to, newValue);
        parents.set(edge.to, idx);
      }
    }
  }

  cached.set(cacheKey, {
    distances,
    visited,
    parents,
    directions,
  });

  return {
    distances,
    visited,
    parents,
    directions,
  };
}

const directionOffset = {
  "<": [-1, 0],
  ">": [1, 0],
  "^": [0, -1],
  v: [0, 1],
};

function makeGraph() {
  const graph = [];
  const peaksMap = new Map();
  const getPeak = (x, y) => {
    const cord = `${x},${y}`;
    if (peaksMap.has(cord)) {
      return peaksMap.get(cord);
    }

    const idx =
      graph.push({
        cord,
        data: [],
      }) - 1;
    peaksMap.set(cord, idx);
    return idx;
  };

  const addParentToPeak = (idx, pX, pY, direction) => {
    const [offsetX, offsetY] = directionOffset[direction];
    const toX = pX + offsetX;
    const toY = pY + offsetY;
    const toSymbol = baseLines[toY]?.[toX];
    if (!toSymbol || toSymbol === "#") {
      return;
    }

    const toIdx = getPeak(toX, toY);
    if (graph[idx].data.some((p) => p.to === toIdx)) {
      return;
    }

    graph[idx].data.push({
      to: toIdx,
      weight: 1,
      direction,
      symbol: toSymbol,
      cord: `${toX},${toY}`,
    });
  };

  for (let y = 0; y < baseLines.length; y++) {
    for (let x = 0; x < baseLines[y].length; x++) {
      if (baseLines[y][x] === "#") {
        continue;
      }

      const idx = getPeak(x, y);
      addParentToPeak(idx, x, y, "<");
      addParentToPeak(idx, x, y, ">");
      addParentToPeak(idx, x, y, "^");
      addParentToPeak(idx, x, y, "v");
    }
  }

  return { graph, peaksMap };
}

console.log("Calculating graph...");
const { graph, peaksMap } = makeGraph();
const startPos = peaksMap.get(`${start.x},${start.y}`);
const endPos = peaksMap.get(`${end.x},${end.y}`);
console.log("Calculating path...");

const { distances, parents, directions } = dijkstra(graph, startPos);

const total = distances.get(endPos);
console.log(`Part 1: ${total}`);

const getPaths = (parents) => {
  let parent = parents.get(endPos);
  const paths = [];
  while (parent) {
    paths.push(graph[parent].cord);
    parent = parents.get(parent);
  }

  return paths;
};

const origPaths = getPaths(parents);

const findTiles = (paths) => {
  const tiles = Array.from(paths);
  for (const pathCord of paths) {
    const newStartPos = peaksMap.get(pathCord);
    const startPoses = [
      newStartPos,
      ...graph[newStartPos].data.map((p) => p.to),
    ];
    for (const startPos of startPoses) {
      const { parents: newParents, distances: distancesNew } = dijkstra(
        graph,
        startPos,
        directions.get(startPos)
      );

      const newPaths = getPaths(newParents);
      if (total === distancesNew.get(endPos) + distances.get(startPos)) {
        tiles.push(...newPaths);
      }
    }

    console.log(`${(paths.indexOf(pathCord) / paths.length) * 100}%`);
  }

  return tiles;
};

console.log("Calculating tiles...");
const tiles = findTiles(origPaths);
const finalTiles = new Set(tiles);
const totalPartTwo = finalTiles.size + 1;
console.log("Part 2:", totalPartTwo);

// console.log(
//   baseLines
//     .map((line, y) =>
//       line
//         .map((val, x) => {
//           return finalTiles.has(`${x},${y}`) ? styleText("bold", "O") : val;
//         })
//         .join("")
//     )
//     .join("\n")
// );
