import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const [registers, program] = input.replaceAll("\r", "").split("\n\n");

let [registerA, registerB, registerC] = registers
  .split("\n")
  .map((register) => +register.match(/-?\d+/g));

const getCombo = (val) => {
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
const adv = (val) => {
  registerA = Math.floor(registerA / 2 ** getCombo(val));
  pointer += 2;
};

// opcode 1
const bxl = (literal) => {
  registerB ^= literal;
  pointer += 2;
};

// opcode 2
const bst = (val) => {
  registerB = getCombo(val) % 8;
  pointer += 2;
};

// opcode 3
const jnz = (literal) => {
  if (registerA === 0) {
    pointer += 2;
    return;
  }

  pointer = literal;
};

// opcode 4
const bxc = (_) => {
  registerB ^= registerC;
  pointer += 2;
};

// opcode 5
const out = (val) => {
  output.push(getCombo(val) % 8);
  pointer += 2;
};

// opcode 6
const bdv = (val) => {
  registerB = Math.floor(registerA / 2 ** getCombo(val));
  pointer += 2;
};

// opcode 7
const cdv = (val) => {
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
const output = [];

while (pointer < commandsList.length) {
  const commandVal = +commandsList[pointer];
  const operand = +commandsList[pointer + 1];
  const command = instructions[commandVal];
  command(operand);
}

const total = output.join(",");

console.log(`Part 1: ${total}`);
