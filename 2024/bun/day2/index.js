import { getFile } from "../../../utils/bun/utils.js";

const input = await getFile(import.meta.dir);

const reports = input
  .split("\n")
  .map((report) => report.split(" ").map((level) => +level));

const isDiffer = (val, nextVal) => {
  const differ = Math.abs(val - nextVal);
  return differ < 1 || differ > 3;
};

const isSafe = (report, useDampener = false) => {
  let isIncreasing;
  const length = report.length - 1;
  const checkedReports = report.map((val, idx) => {
    if (idx >= length) {
      return true;
    }

    const nextVal = report[idx + 1];
    if (isDiffer(val, nextVal)) {
      return false;
    }

    if (isIncreasing === undefined) {
      isIncreasing = val < nextVal;
      return true;
    }

    return isIncreasing ? val < nextVal : val > nextVal;
  });
  const safeReports = checkedReports.filter((level) => level);
  const badLevelCount = report.length - safeReports.length;
  if (badLevelCount === 0) {
    return true;
  }

  if (!useDampener) {
    return false;
  }

  return report.some((_, idx) => {
    return isSafe(report.filter((_, idx1) => idx1 !== idx));
  });
};

const [totalSafe, totalSafeWithDampener] = reports.reduce(
  ([total, totalWithDampener], report) => {
    const isSafeReport = isSafe(report);
    const isSafeReportWithDampener = isSafe(report, true);
    total += Number(isSafeReport);
    totalWithDampener += Number(isSafeReportWithDampener);

    return [total, totalWithDampener];
  },
  [0, 0]
);

console.log(`Part 1: ${totalSafe}`);
console.log(`Part 2: ${totalSafeWithDampener}`);
