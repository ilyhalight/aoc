import fs from "node:fs";

export async function getFile(folder: string) {
  const decoder = new TextDecoder("utf-8");
  const filename = fs.existsSync(`${folder}/input.txt`) ? "input" : "sample";
  const data = await Deno.readFile(`${folder}/${filename}.txt`);
  return decoder.decode(data);
}
