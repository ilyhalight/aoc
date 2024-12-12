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

const isNearest = (val, otherVal) => {
  return val + 1 === otherVal || val - 1 === otherVal;
};

const getNearbyPlotsWithDirection = (plots, x, y) => {
  const nearbyPlots = getNearbyPlots(plots, x, y);
  return {
    top: nearbyPlots.find(([plotX, plotY]) => plotX === x && plotY === y - 1),
    left: nearbyPlots.find(([plotX, plotY]) => plotX === x - 1 && plotY === y),
    right: nearbyPlots.find(([plotX, plotY]) => plotX === x + 1 && plotY === y),
    bottom: nearbyPlots.find(
      ([plotX, plotY]) => plotX === x && plotY === y + 1
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

// console.log(regions);

const regionsWithData = new Map();
let total = 0;
let totalPartTwo = 0;

for (const [symbol, regionList] of regions) {
  const regions = [];
  for (const region of regionList) {
    let perimeter = 0;
    const { plots, id } = region;
    const sides = [];
    const debug = [];
    for (let i = 0; i < plots.length; i++) {
      const plot = plots[i];
      const [x, y] = plot;
      const { nearby, top, left, bottom, right } = getNearbyPlotsWithDirection(
        plots,
        x,
        y
      );
      // console.log(plot, top, left, right, bottom);

      if (!top) {
        sides.push([x, y - 1]);
      }

      if (!left) {
        sides.push([x - 1, y]);
      }

      if (!right) {
        sides.push([x + 1, y]);
      }

      if (!bottom) {
        sides.push([x, y + 1]);
      }

      debug.push([
        {
          top: top ? undefined : [x, y - 1],
          left: left ? undefined : [x - 1, y],
          right: right ? undefined : [x + 1, y],
          bottom: bottom ? undefined : [x, y + 1],
          plot,
        },
      ]);
      // console.log("sides", sides);
      perimeter += 4 - nearby.length;
    }

    const area = plots.length;
    const clearedSides = sides.filter(
      ([sideX, sideY]) =>
        !plots.some(([plotX, plotY]) => plotX === sideX && plotY === sideY)
    );

    const horizontalLines = [];
    const verticalLines = [];
    for (let i = 0; i < sides.length; i++) {
      const [sideX, sideY] = sides[i];
      const horizontalId = horizontalLines.findIndex(
        (line) =>
          line.some(([x, y]) => isNearest(x, sideX) && sideY === y) &&
          !line.some(([x, y]) => x === sideX && y === sideY)
      );
      const verticalId = verticalLines.findIndex((line) =>
        line.some(
          ([x, y]) =>
            x === sideX &&
            isNearest(y, sideY) &&
            !line.some(([x, y]) => x === sideX && y === sideY)
        )
      );
      // console.log(sides[i], horizontalId, verticalId);
      if (horizontalId !== -1) {
        horizontalLines[horizontalId].push([sideX, sideY]);
      }

      if (verticalId !== -1) {
        verticalLines[verticalId].push([sideX, sideY]);
      }

      if (horizontalId !== -1 || verticalId !== -1) {
        continue;
      }

      horizontalLines.push([[sideX, sideY]]);
      verticalLines.push([[sideX, sideY]]);
    }
    const possible = [];
    const lines = horizontalLines.reduce((result, line, idx) => {
      result.push(line.length === 1 ? verticalLines[idx] : line);
      if (line.length > 1 && verticalLines[idx].length > 1) {
        const isDifferent = line.some(([x, y], i) => {
          const vLine = verticalLines[idx][i];
          if (!vLine) {
            return true;
          }

          const [vX, vY] = vLine;
          return x !== vX || y !== vY;
        });
        if (isDifferent) {
          possible.push(verticalLines[idx]);
        }
      }

      if (line.length === 2 && idx < horizontalLines.length - 1) {
        const isSingleLine = line.every(([x, y], i) => {
          if (verticalLines[idx + i].length !== 1) {
            return false; // TODO: need set true for some cases
          }

          const [vX, vY] = verticalLines[idx + i][0];
          return x === vX && y === vY;
        });
        if (isSingleLine) {
          result.push([verticalLines[idx], verticalLines[idx + 1]]);
        }
      }

      return result;
    }, []);

    if (lines.length % 2 !== 0 && possible.length) {
      lines.push(
        ...(possible.length % 2 === 0
          ? possible.slice(0, possible.length - 1)
          : possible)
      );
    }

    regions.push({
      id,
      plots,
      area,
      perimeter,
      // debug,
      clearedSides,
      clearedCount: clearedSides.length,
      sides: lines,
      sidesCount: lines.length,
    });

    total += area * perimeter;
    totalPartTwo += area * lines.length;
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
console.log(`Part 2 (invalid for some cases): ${totalPartTwo}`);
