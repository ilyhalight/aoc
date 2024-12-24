import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const connections = input.replaceAll("\r", "").split("\n");

const connectionTree = new Map();
const alreadyConnected = new Set();

for (const connection of connections) {
  const [left, right] = connection.split("-");
  const oldConnections2 = connectionTree.get(right);
  connectionTree.set(
    right,
    oldConnections2 ? [...oldConnections2, left] : [left]
  );

  const oldConnections = connectionTree.get(left);
  connectionTree.set(
    left,
    oldConnections ? [...oldConnections, right] : [right]
  );
  alreadyConnected.add(right);
}

const checkedClients = new Set();

const checkTree = (client, parent = "", depth = 0) => {
  const pairs = [];
  if (depth > 1) {
    return pairs;
  }

  const childrens = connectionTree.get(client);
  if (!childrens.find((child) => child === parent)) {
    return pairs;
  }

  return childrens
    .filter((child) => child !== parent)
    .map((child) => {
      checkedClients.add(child);
      const childConnections = connectionTree.get(child);
      return childConnections.includes(parent) ? child : false;
    })
    .filter((child) => child);
};

const pairs = [];
const passwords = new Map();

for (const [connection, childrens] of connectionTree.entries()) {
  checkedClients.clear();
  const pairConnections = new Set();
  for (const child of childrens) {
    const childData = checkTree(child, connection);
    for (const data of childData) {
      pairConnections.add(data);
    }
  }

  const arrPairConnectionss = Array.from(pairConnections);
  const temp = [];
  for (let i = 0; i < arrPairConnectionss.length; i++) {
    const pair = arrPairConnectionss[i];
    if (connectionTree.get(pair).includes(connection)) {
      temp.push(pair);
    }

    if (!connection.startsWith("t")) {
      continue;
    }

    for (let j = i + 1; j < arrPairConnectionss.length; j++) {
      const nextPair = arrPairConnectionss[j];
      if (connectionTree.get(nextPair).includes(pair)) {
        pairs.push([connection, pair, nextPair].sort().join(","));
      }
    }
  }

  const key = [connection, ...temp].sort().join(",");
  passwords.set(key, passwords.has(key) ? passwords.get(key) + 1 : 1);
}

const total = new Set(pairs);
const totalPartTwo = passwords.entries().reduce(
  ([password, count], [key, val]) => {
    if (val > count) {
      password = key;
      count = val;
    }

    return [password, count];
  },
  ["", 0]
);

console.log(`Part 1: ${total.size}`);

console.log(`Part 2: ${totalPartTwo[0]}`);
