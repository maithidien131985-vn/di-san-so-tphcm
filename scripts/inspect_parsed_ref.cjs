const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scripts/parsed_ref_excels.json', 'utf8'));

Object.keys(data).forEach(k => {
  console.log(`=== ${k} (Total rows: ${data[k].length}) ===`);
  const header = data[k][0];
  console.log('Header:', header);
  for (let i = 1; i <= Math.min(3, data[k].length - 1); i++) {
    console.log(`Row ${i}:`, data[k][i]);
  }
});
