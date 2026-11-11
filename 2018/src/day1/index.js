import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);
const actions = input.split("\n");
const checked = new Set([0]);
let result2;

const checkFreq = (num) => {
  if (!result2 && checked.has(num)) {
    result2 = num;
    return true;
  }

  checked.add(num);
};

let result = actions.reduce((acc, action) => {
  const res = acc + parseInt(action);
  checkFreq(res);

  return res;
}, 0);

console.log(`answer 1 - ${result}`);

while (result2 === undefined) {
  for (const action of actions) {
    const res = result + parseInt(action);
    const founded = checkFreq(res);
    if (founded) {
      break;
    }

    result = res;
  }
}

console.log(`answer 2 - ${result2}`);
