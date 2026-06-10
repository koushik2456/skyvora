const fs = require('fs');
const file = process.argv[2];
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
console.log('TAG:', r.tag_name, '|', r.name, '| assets:', r.assets.length);
r.assets
  .filter((a) => /village|sub_district|subdistrict|district|state/i.test(a.name))
  .forEach((a) => console.log(a.name, '|', Math.round(a.size / 1024) + 'KB'));
