const decompile = (value) => {
  const strValue = String(value);
  const reversed = (
    strValue[strValue.length - 1] + strValue.slice(0, strValue.length - 1)
  )
    .split("")
    .reverse()
    .join("");
  return parseInt(reversed, 8).toString(10);
};

console.log(decompile(5730));
