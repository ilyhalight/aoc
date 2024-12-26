import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const codes = input.replaceAll("\r", "").split("\n");

const keypad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["", "0", "A"],
];

const navpad = [
  ["", "^", "A"],
  ["<", "v", ">"],
];

const getSymbols = (symbol: string, count: number) =>
  Array.from({ length: count }).fill(symbol).join("");

const getMoveKeyStr = (
  currentX: number,
  currentY: number,
  x: number,
  y: number,
  len: number
) => {
  const offsetX = currentX - x;
  const offsetY = currentY - y;
  if (x === currentX && y === currentY) {
    return "";
  }

  if (offsetX === 0) {
    return getSymbols(offsetY > 0 ? "^" : "v", Math.abs(offsetY));
  }

  if (offsetY === 0) {
    return getSymbols(offsetX > 0 ? "<" : ">", Math.abs(offsetX));
  }

  if (x === 0 && currentY === 3) {
    return (
      getSymbols(offsetY > 0 ? "^" : "v", Math.abs(offsetY)) +
      getSymbols(offsetX > 0 ? "<" : ">", Math.abs(offsetX))
    );
  }

  if (
    len === keypad.length &&
    x !== 0 &&
    currentY - offsetY !== 3 &&
    offsetX < 0
  ) {
    return (
      getSymbols(offsetY > 0 ? "^" : "v", Math.abs(offsetY)) +
      getSymbols(">", Math.abs(offsetX))
    );
  }

  return (
    getSymbols(offsetX > 0 ? "<" : ">", Math.abs(offsetX)) +
    getSymbols(offsetY > 0 ? "^" : "v", Math.abs(offsetY))
  );
};

const calcRobotMoves = (
  code: string,
  padPanel: typeof keypad | typeof navpad,
  start = [2, 3]
) => {
  let pos = start;
  let codeKeys = code.split("");
  // console.log(codeKeys);
  let result = "";

  while (codeKeys.length) {
    const val = codeKeys[0];
    for (let y = 0; y < padPanel.length; y++) {
      const line = padPanel[y];
      if (line.includes(val)) {
        const [currentX, currentY] = pos;
        const x = line.indexOf(val);
        // console.log(val);
        const moveString =
          getMoveKeyStr(currentX, currentY, x, y, padPanel.length) + "A";
        result += moveString;
        pos = [x, y];
        break;
      }
    }

    codeKeys = codeKeys.slice(1);
  }

  return result;
};

const results = new Map();

for (const code of codes) {
  const keypadMoves = calcRobotMoves(code, keypad);
  // console.log("1 ==========", keypadMoves);
  const firstNavMoves = calcRobotMoves(keypadMoves, navpad, [2, 0]);
  // console.log("2 ==========", firstNavMoves);
  const secondNavMoves = calcRobotMoves(firstNavMoves, navpad, [2, 0]);
  // console.log("3 ==========", secondNavMoves);

  // console.log(result);
  // console.log(secondNavMoves);
  results.set(code, secondNavMoves);
}

const total = results.entries().reduce((total, [key, value]) => {
  total += value.length * parseInt(key);

  return total;
}, 0);

console.log(`Part 1: ${total}`);
