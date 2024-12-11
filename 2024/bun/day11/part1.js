import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const baseLine = input
  .replaceAll("\r", "")
  .split(" ")
  .map((v) => +v);

const memory = new Map();
memory.set(0, [0]);

const calc = (value) => {
  if (memory.has(value)) {
    return memory.get(value);
  }

  const strVal = value.toString();
  if (strVal.length % 2 !== 0) {
    return [value * 2024];
  }

  const middle = strVal.length / 2;
  return [+strVal.slice(0, middle), +strVal.slice(middle)];
};

const blink = (line) => {
  return line.reduce((result, val) => {
    result.push(...calc(val));
    return result;
  }, []);
};

console.log("calculating part 1...");
const blinkCount = 25;
let line = baseLine;
for (let i = 0; i < blinkCount; i++) {
  line = blink(line);
}

const total = line.length;
const totalPartTwo = 0;

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
