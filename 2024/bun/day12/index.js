import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const baseLines = input
  .replaceAll("\r", "")
  .split("\n")
  .map((line) => line.split(""));

const regions = new Map();

const getNearbyPlots = (plots, x, y) => {
  return plots.filter((plot) => {
    const [nearX, nearY] = plot;
    return (
      // is upper
      (nearX === x && nearY + 1 === y) ||
      // is left
      (nearX + 1 === x && nearY === y) ||
      // is right
      (nearX - 1 === x && nearY === y) ||
      // is bottom
      (nearX === x && nearY - 1 === y)
    );
  });
};

const getNearbyPlotsWithDirection = (plots, x, y) => {
  const nearbyPlots = getNearbyPlots(plots, x, y);
  return {
    top: nearbyPlots.find(([plotX, plotY]) => plotX === x && plotY === y - 1),
    topLeft: plots.find(([plotX, plotY]) => plotX === x - 1 && plotY === y - 1),
    left: nearbyPlots.find(([plotX, plotY]) => plotX === x - 1 && plotY === y),
    right: nearbyPlots.find(([plotX, plotY]) => plotX === x + 1 && plotY === y),
    topRight: plots.find(
      ([plotX, plotY]) => plotX === x + 1 && plotY === y - 1
    ),
    bottom: nearbyPlots.find(
      ([plotX, plotY]) => plotX === x && plotY === y + 1
    ),
    bottomLeft: plots.find(
      ([plotX, plotY]) => plotX === x - 1 && plotY === y + 1
    ),
    bottomRight: plots.find(
      ([plotX, plotY]) => plotX === x + 1 && plotY === y + 1
    ),
    nearby: nearbyPlots,
  };
};

for (let y = 0; y < baseLines.length; y++) {
  const line = baseLines[y];
  for (let x = 0; x < line.length; x++) {
    const symbol = line[x];
    const newRegion = {
      id: `${x},${y}`,
      plots: [[x, y]],
    };
    if (!regions.has(symbol)) {
      regions.set(symbol, [newRegion]);
      continue;
    }

    const allSubRegions = regions.get(symbol);
    const nearbyRegions = allSubRegions.filter((region) => {
      return getNearbyPlots(region.plots, x, y).length;
    });
    if (nearbyRegions.length) {
      const subRegionsWithoutNearby = allSubRegions.filter(
        (region) => !nearbyRegions.some((reg) => reg.id === region.id)
      );
      const nearbyPlots = nearbyRegions.map((region) => region.plots).flat();
      regions.set(symbol, [
        ...subRegionsWithoutNearby,
        {
          id: nearbyRegions[0].id,
          plots: [...nearbyPlots, [x, y]],
        },
      ]);
      continue;
    }

    regions.set(symbol, [...allSubRegions, newRegion]);
  }
}

const regionsWithData = new Map();
let total = 0;
let totalPartTwo = 0;

for (const [symbol, regionList] of regions) {
  const regions = [];
  for (const region of regionList) {
    let perimeter = 0;
    const { plots, id } = region;
    const sides = [];
    for (let i = 0; i < plots.length; i++) {
      const plot = plots[i];
      const [x, y] = plot;
      const {
        nearby,
        topLeft,
        top,
        topRight,
        left,
        bottomLeft,
        bottom,
        bottomRight,
        right,
      } = getNearbyPlotsWithDirection(plots, x, y);

      if ((!topLeft && top && left) || (!top && !left)) {
        sides.push([x - 1, y - 1]);
      }

      if ((!topRight && top && right) || (!top && !right)) {
        sides.push([x + 1, y - 1]);
      }

      if ((!bottomLeft && bottom && left) || (!bottom && !left)) {
        sides.push([x + 1, y]);
      }

      if ((!bottomRight && bottom && right) || (!bottom && !right)) {
        sides.push([x + 1, y + 1]);
      }

      perimeter += 4 - nearby.length;
    }

    const area = plots.length;

    regions.push({
      id,
      plots,
      area,
      perimeter,
      sides,
      sidesCount: sides.length,
    });

    total += area * perimeter;
    totalPartTwo += area * sides.length;
  }

  regionsWithData.set(symbol, regions);
}

// console.log(Bun.inspect(regionsWithData));

// for (const [symbol, regionList] of regions) {
//   // console.log(region);
//   for (const region of regionList) {
//     const regionMap = [...Array(baseLines.length + 1)].map((_) =>
//       [...Array(baseLines.length + 1)].map((_) => ".")
//     );
//     for (const pos of region.plots) {
//       const [x, y] = pos;
//       regionMap[y][x] = symbol;
//     }

//     console.log(regionMap.map((s) => s.join("")).join("\n"));
//     console.log("---");
//   }
// }

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${totalPartTwo}`);
