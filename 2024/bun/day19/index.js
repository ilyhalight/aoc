import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

let [patterns, towels] = input.replaceAll("\r", "").split("\n\n");

patterns = patterns.split(", ").sort((a, b) => b.length - a.length);
towels = towels.split("\n");

const cache = new Map();

const checkPatterns = (towel, level = 0) => {
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
