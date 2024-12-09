import { getFile } from "../../../utils/deno/utils.ts";

const input = await getFile(import.meta.dirname!);

const baseLine = input
  .replaceAll("\r", "")
  .split("")
  .map((v) => +v);

let currentId = 0;
type Block = string | number;

const repeatSymbol = (symbol: Block, repeats = 0) => {
  return [...Array(repeats)].map((_) => symbol);
};

const blocks = baseLine.reduce((result, num, idx) => {
  let symbol: string | number = currentId;
  if (idx % 2 !== 0) {
    currentId += 1;
    symbol = ".";
  }

  result.push(...repeatSymbol(symbol, num));
  return result;
}, [] as Block[]);

const getBlocks = () => {
  return JSON.parse(JSON.stringify(blocks));
};

const fragmentation = (blocks: Block[]) => {
  const fragmented = [];
  for (let i = 0; i < blocks.length; i++) {
    const symbol = blocks[i];
    if (symbol !== ".") {
      fragmented.push(symbol);
      continue;
    }

    for (let j = blocks.length - 1; j > i; j--) {
      const symbolInEnd = blocks[j];
      if (symbolInEnd === ".") {
        continue;
      }

      fragmented.push(symbolInEnd);
      blocks[j] = ".";
      break;
    }
  }

  return fragmented;
};

const moveFiles = (blocks: Block[]) => {
  const movedFiles = [];
  let spaces = 1;
  let tempBlock: Block[] = [];
  const usedSymbols = new Set();

  let separatedBlocks = blocks
    .reduce((result, block, idx) => {
      if (block === ".") {
        return result;
      }

      const nextBlock = blocks[idx + 1];
      if (nextBlock !== block) {
        tempBlock.push(block);
        result.push(tempBlock);
        tempBlock = [];
        return result;
      }

      tempBlock.push(block);
      return result;
    }, [] as Block[][])
    .reverse();

  for (let i = 0; i < blocks.length; i++) {
    const symbol = blocks[i];
    const nextSymbol = blocks[i + 1];
    if (usedSymbols.has(symbol)) {
      movedFiles.push(".");
      continue;
    }

    if (symbol !== ".") {
      movedFiles.push(symbol);
      if (symbol !== nextSymbol) {
        usedSymbols.add(symbol);
      }
      continue;
    }

    if (nextSymbol === ".") {
      spaces += 1;
      continue;
    }

    for (const blockLength = 0; blockLength < spaces; ) {
      const block = separatedBlocks.find(
        (b) => b.length <= spaces && !usedSymbols.has(b[0])
      );
      if (!block) {
        movedFiles.push(".");
        spaces -= 1;
        continue;
      }

      separatedBlocks = separatedBlocks.filter((b) => b !== block);
      spaces -= block.length;
      usedSymbols.add(block[0]);
      movedFiles.push(...block);
    }

    spaces = 1;
  }

  return movedFiles;
};

const calcChecksum = (blocks: Block[]): number => {
  return blocks.reduce((result: number, block: Block, idx: number) => {
    if (block === ".") {
      return result;
    }

    result += idx * (block as number);
    return result;
  }, 0);
};

console.log("calculating part 1...");
const fragmented = fragmentation(getBlocks());
const checksumFragmented = calcChecksum(fragmented);

console.log("calculating part 2...");
const movedFiles = moveFiles(getBlocks());
const checksumMovedFiles = calcChecksum(movedFiles);

const total = checksumFragmented;
const totalPartTwo = checksumMovedFiles;

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
