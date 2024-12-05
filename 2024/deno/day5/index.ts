import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const [rules, pages] = input
  .replaceAll("\r", "")
  .split("\n\n")
  .map((section) => section.split("\n"));

const orderRules = rules.map((ruleLine) =>
  ruleLine.split("|").map((val) => +val)
);

const checkOrder = (line: number[], rule: number[]) => {
  const [first, second] = rule;
  const firstPos = line.indexOf(first);
  const secondPos = line.indexOf(second);
  if (firstPos === -1 || secondPos === -1) {
    return true;
  }

  return firstPos < secondPos;
};

const checkPageLine = (line: number[]) => {
  for (const rule of orderRules) {
    if (!checkOrder(line, rule)) {
      return false;
    }
  }

  return true;
};

const calcTotal = (total: number, line: number[]) => {
  const offset = (line.length - 1) / 2;
  return total + line[offset];
};

const pageLines = pages.map((line) => line.split(",").map((val) => +val));

const total = pageLines.filter(checkPageLine).reduce(calcTotal, 0);

const totalPartTwo = pageLines
  .filter((line) => !checkPageLine(line))
  .map((line) => {
    while (!checkPageLine(line)) {
      for (const rule of orderRules) {
        if (checkOrder(line, rule)) {
          continue;
        }

        const [first, second] = rule;
        const firstPos = line.indexOf(first);
        const secondPos = line.indexOf(second);
        line[secondPos] = first;
        line[firstPos] = second;
      }
    }

    return line;
  })
  .reduce(calcTotal, 0);

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
