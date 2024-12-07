import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const baseLines = input
  .replaceAll("\r", "")
  .split("\n")
  .map((line) =>
    line.split(":").map((num) =>
      num
        .trim()
        .split(" ")
        .map((num) => +num)
    )
  );

const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;
const concatenate = (a, b) => +`${a}${b}`;
const operationActions = {
  "+": sum,
  "*": multiply,
  "|": concatenate,
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getActions = (nums, operations) => {
  const mixed = new Set();
  const numCount = nums.length - 1;
  const maxOperations = operations.length ** numCount;
  while (mixed.size < maxOperations) {
    const key = nums.reduce((res, val, idx) => {
      if (idx !== 0) {
        res.push(operations[random(0, operations.length - 1)]);
      }

      res.push(val);

      return res;
    }, []);

    mixed.add(key.toString());
  }

  return Array.from(mixed);
};

const calc = (numsWithActions, result) => {
  for (const withAction of numsWithActions) {
    let total = 0;
    const withActionArray = withAction.split(",").map((s) => {
      const val = +s;
      return Number.isNaN(val) ? s : val;
    });
    for (let i = 0; i < withActionArray.length; i += 2) {
      if (i + 2 > withActionArray.length) {
        break;
      }

      const left = total === 0 ? withActionArray[i] : total;
      const action = operationActions[withActionArray[i + 1]];
      const right = withActionArray[i + 2];
      total = action(left, right);
    }

    if (total === result) {
      return total;
    }
  }

  return 0;
};

console.log("calculating part 1...");
const total = baseLines.reduce((total, line) => {
  const [[result], nums] = line;
  const numsWithActions = getActions(nums, ["+", "*"]);

  return total + calc(numsWithActions, result);
}, 0);

console.log("calculating part 2 (It can take quite a long time)...");
const totalPartTwo = baseLines.reduce((total, line, idx) => {
  const [[result], nums] = line;
  const numsWithActions = getActions(nums, ["+", "*", "|"]);
  console.log(idx, "/", baseLines.length);

  return total + calc(numsWithActions, result);
}, 0);

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
