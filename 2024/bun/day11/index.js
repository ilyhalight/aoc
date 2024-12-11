import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const baseLine = input
  .replaceAll("\r", "")
  .split(" ")
  .map((v) => +v);

const memoryCalc = new Map();
const memoryBlink = new Map();
memoryCalc.set(0, 1);

const calc = (value) => {
  if (memoryCalc.has(value)) {
    return memoryCalc.get(value);
  }

  const strVal = value.toString();
  if (strVal.length % 2 !== 0) {
    const result = value * 2024;
    memoryCalc.set(value, result);
    return result;
  }

  const middle = strVal.length / 2;
  const result = [+strVal.slice(0, middle), +strVal.slice(middle)];
  memoryCalc.set(value, result);
  return result;
};

const blink = (value, count) => {
  const key = `${value}:${count}`;
  if (memoryBlink.has(key)) {
    return memoryBlink.get(key);
  }

  let stones = 1;
  for (let i = 0; i < count; i++) {
    const newVal = calc(value);
    // console.log(value, newVal, count);
    if (Array.isArray(newVal)) {
      // console.log(value, newVal, count, i, count - i);
      stones += blink(newVal[1], count - i - 1);
      value = newVal[0];
    } else {
      value = newVal;
    }
  }

  memoryBlink.set(key, stones);

  return stones;
};

console.log("calculating part 1...");

const total = baseLine.reduce((result, val) => {
  return result + blink(val, 25);
}, 0);

// for part 2
console.log("calculating part 2...");
const totalPartTwo = baseLine.reduce((result, val) => {
  return result + blink(val, 75);
}, 0);

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
