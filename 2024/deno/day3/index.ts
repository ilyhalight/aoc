import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const validInstructions = input.match(
  /(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g
) as RegExpMatchArray;

let isMulDisabled = false;

type MulInstruct = `mul(${number},${number})`;

const execInstuction = (instruction: MulInstruct) => {
  const [, left, right] = instruction.match(/(\d+),(\d+)/) as RegExpMatchArray;
  return +left * +right;
};

const total = validInstructions.reduce((total: number, instruction: string) => {
  if (!instruction.startsWith("mul(")) {
    return total;
  }

  return total + execInstuction(instruction as MulInstruct);
}, 0);

const totalPartTwo = validInstructions.reduce(
  (total: number, instruction: string) => {
    if (!instruction.startsWith("mul(")) {
      isMulDisabled = instruction === "don't()";
      return total;
    }

    if (isMulDisabled) {
      return total;
    }

    return total + execInstuction(instruction as MulInstruct);
  },
  0
);

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
