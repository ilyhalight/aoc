import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);
const rows = input.split("\n");

let twos = 0;
let threes = 0;

for (const row of rows) {
  const chars = row.split("");
  const uniqChars = new Set(chars);
  let two = false;
  let three = false;

  for (const char of uniqChars) {
    if (two && three) {
      break;
    }

    const count = chars.filter((c) => c === char).length;
    if (count === 2 && !two) {
      two = true;
    }

    if (count === 3 && !three) {
      three = true;
    }
  }

  if (!three && !two) {
    continue;
  }

  if (two) {
    twos += 1;
  }

  if (three) {
    threes += 1;
  }
}

console.log(`answer 1: ${twos * threes}`);
const combos = rows.map((row) => row.split(""));
for (const combo of combos) {
  let found = false;
  for (const otherCombo of combos) {
    if (combo === otherCombo) {
      continue;
    }

    const diffs = combo.map((c, i) => c !== otherCombo[i]).filter(Boolean).length;
    if (diffs !== 1) {
      continue;
    }

    const answer = combo.filter((c, i) => c === otherCombo[i]).join("");
    console.log(`answer 2: ${answer}`);
    found = true;
    break;
  }
  if (found) {
    break;
  }
}
