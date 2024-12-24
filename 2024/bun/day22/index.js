import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const secretNumbers = input
  .replaceAll("\r", "")
  .split("\n")
  .map((num) => +num);

const mix = (a, b) => {
  return a ^ b;
};

const prune = (a) => {
  return a % 16777216n;
};

const cache = new Map();

const calcNext = (secret) => {
  if (cache.has(secret)) {
    return cache.get(secret);
  }

  const oldSecret = secret;
  secret = prune(mix(secret * 64n, secret));
  secret = prune(mix(secret / 32n, secret));
  secret = prune(mix(secret * 2048n, secret));
  cache.set(oldSecret, secret);
  return secret;
};

const bananaCount = new Map();
const sequence = new Map();

console.log("Calculating all parts (It may take about a minute)...");
const total = secretNumbers.reduce((total, secretNumber) => {
  let secret = BigInt(secretNumber);
  let test = [+secretNumber.toString().slice(-1)];
  for (let i = 0; i < 2000; i++) {
    secret = calcNext(secret);
    test.push(+secret.toString().slice(-1));
  }

  const data = test.reduce((res, val, idx) => {
    if (idx === 0) {
      return res;
    }

    res.push(val - test[idx - 1]);
    return res;
  }, []);

  test = test.slice(1);
  let debug = test;
  let max = -1;
  let maxIdx = -1;
  while (debug.length > 0) {
    debug = debug.filter((val) => val !== max);
    max = Math.max(...debug);
    maxIdx = test.indexOf(max);
    if (
      !Number.isFinite(max) ||
      maxIdx + 4 > test.length ||
      test[maxIdx + 4] !== max
    ) {
      continue;
    }

    const val = [
      data[maxIdx + 1],
      data[maxIdx + 2],
      data[maxIdx + 3],
      data[maxIdx + 4],
    ];
    const key = val.join();
    if (!sequence.has(key)) {
      sequence.set(key, val);
    }
  }

  bananaCount.set(secretNumber, [test, data]);

  return total + secret;
}, 0n);

const variants = sequence
  .values()
  .reduce((selledList, [zero, first, second, third]) => {
    const maxPrice = bananaCount.values().reduce((result, [values, data]) => {
      const pos = data.findIndex((val, idx) => {
        if (idx - 3 < 0) {
          return false;
        }

        return (
          val === third &&
          data[idx - 1] === second &&
          data[idx - 2] === first &&
          data[idx - 3] === zero
        );
      });

      if (pos === -1) {
        return result;
      }

      return result + values[pos];
    }, 0);

    selledList.push(maxPrice);

    return selledList;
  }, []);

const totalPartTwo = Math.max(...variants);

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
