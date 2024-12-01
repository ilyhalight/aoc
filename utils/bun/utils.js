export async function getFile(folder) {
  let file = Bun.file(`${folder}/input.txt`);
  if (file.size === 0) {
    file = Bun.file(`${folder}/sample.txt`);
  }

  return await file.text();
}
