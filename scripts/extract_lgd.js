const _7z = require('7zip-min');
const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, 'lgd_raw');
const outDir = path.join(__dirname, 'lgd_csv');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const archives = fs.readdirSync(rawDir).filter((f) => f.endsWith('.7z'));
  for (const a of archives) {
    await new Promise((resolve, reject) => {
      _7z.unpack(path.join(rawDir, a), outDir, (err) => (err ? reject(err) : resolve()));
    });
    console.log('extracted', a);
  }
  console.log(fs.readdirSync(outDir));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
