import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const [inputPatterns, inputTowels] = input.replaceAll("\r", "").split("\n\n");

const patterns = inputPatterns.split(", ").sort((a, b) => b.length - a.length);
const towels = inputTowels.split("\n");

const cache = new Map();

const checkPatterns = (towel: string, level = 0): number => {
  if (!towel.length) {
    return 1;
  }

  return patterns
    .filter((pattern) => towel.startsWith(pattern))
    .reduce((result, variant, idx) => {
      const key = `${variant}:${towel}:${level}`;
      const inCache = cache.has(key);
      const data = inCache
        ? cache.get(key)
        : checkPatterns(towel.replace(variant, ""), level + idx);
      if (!inCache) {
        cache.set(key, data);
      }

      return result + data;
    }, 0);
};

let total = 0;
let totalPartTwo = 0;
console.log("Calculating (It may take a few seconds)...");

for (const towel of towels) {
  cache.clear();
  const availabled = checkPatterns(towel);
  if (availabled) {
    total++;
    totalPartTwo += availabled;
  }
}

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
