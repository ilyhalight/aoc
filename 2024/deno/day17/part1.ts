import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const [registers, program] = input.replaceAll("\r", "").split("\n\n");

let [registerA, registerB, registerC] = registers
  .split("\n")
  .map((register: string) => +register.match(/-?\d+/g)!);

const getCombo = (val: number) => {
  switch (val) {
    case 4:
      return registerA;
    case 5:
      return registerB;
    case 6:
      return registerC;
    default:
      return val;
  }
};

// opcode 0
const adv = (val: number) => {
  registerA = Math.floor(registerA / 2 ** getCombo(val));
  pointer += 2;
};

// opcode 1
const bxl = (literal: number) => {
  registerB ^= literal;
  pointer += 2;
};

// opcode 2
const bst = (val: number) => {
  registerB = getCombo(val) % 8;
  pointer += 2;
};

// opcode 3
const jnz = (literal: number) => {
  if (registerA === 0) {
    pointer += 2;
    return;
  }

  pointer = literal;
};

// opcode 4
const bxc = () => {
  registerB ^= registerC;
  pointer += 2;
};

// opcode 5
const out = (val: number) => {
  output.push(getCombo(val) % 8);
  pointer += 2;
};

// opcode 6
const bdv = (val: number) => {
  registerB = Math.floor(registerA / 2 ** getCombo(val));
  pointer += 2;
};

// opcode 7
const cdv = (val: number) => {
  registerC = Math.floor(registerA / 2 ** getCombo(val));
  pointer += 2;
};

const instructions = {
  0: adv,
  1: bxl,
  2: bst,
  3: jnz,
  4: bxc,
  5: out,
  6: bdv,
  7: cdv,
};

const originalCommands = program.split(": ")[1];
const commandsList = originalCommands.split(",");

let pointer = 0;
const output = [] as number[];

while (pointer < commandsList.length) {
  const commandVal = +commandsList[pointer];
  const operand = +commandsList[pointer + 1];
  const command = instructions[commandVal as keyof typeof instructions];
  command(operand);
}

const total = output.join(",");

console.log(`Part 1: ${total}`);
