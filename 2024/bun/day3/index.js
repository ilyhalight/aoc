import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const validInstructions = input.match(
  /(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g
);

let isMulDisabled = false;

const execInstuction = (instruction) => {
  const [, left, right] = instruction.match(/(\d+),(\d+)/);
  return left * right;
};

const total = validInstructions.reduce((total, instruction) => {
  if (!instruction.startsWith("mul(")) {
    return total;
  }

  return total + execInstuction(instruction);
}, 0);

const totalPartTwo = validInstructions.reduce((total, instruction) => {
  if (!instruction.startsWith("mul(")) {
    isMulDisabled = instruction === "don't()";
    return total;
  }

  if (isMulDisabled) {
    return total;
  }

  return total + execInstuction(instruction);
}, 0);

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
