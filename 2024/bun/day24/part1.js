import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const [initialValues, connections] = input.replaceAll("\r", "").split("\n\n");

const values = new Map();
const outputs = new Map();
initialValues.split("\n").map((val) => {
  const [name, value] = val.split(": ");
  values.set(name, +value);
});

const AND = (a, b) => {
  return a === 1 && b === 1;
};

const OR = (a, b) => {
  return a === 1 || b === 1;
};

const XOR = (a, b) => {
  return a !== b;
};

const operators = {
  AND,
  OR,
  XOR,
};

let connectionList = connections.split("\n");

while (connectionList.length) {
  connectionList = connectionList.filter((connection) => {
    const [expression, result] = connection.split(" -> ");
    const [val1, operator, val2] = expression.split(" ");
    if (!values.has(val1) || !values.has(val2)) {
      return true;
    }

    const resultValue = +operators[operator](
      values.get(val1),
      values.get(val2)
    );
    values.set(result, resultValue);
    outputs.set(result, resultValue);
    return false;
  });
}

const binaryTotal = Array.from(outputs.entries())
  .sort()
  .reduce((total, [key, val]) => {
    if (!key.startsWith("z")) {
      return total;
    }

    return val + total;
  }, "")
  .replace(/^0+/, "");
const total = parseInt(binaryTotal, 2);

console.log(`Part 1: ${total}`);
