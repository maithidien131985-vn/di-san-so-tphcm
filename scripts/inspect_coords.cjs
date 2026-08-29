const fs = require('fs');

function parseCSV(text) {
  const p = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      p.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || (row.length === 1 && row[0] !== '')) p.push(row);
  return p;
}

const csv = fs.readFileSync('D:/KHKT/coordinates_sheet.csv', 'utf8');
const rows = parseCSV(csv);
console.log('Total parsed rows:', rows.length);
console.log('Headers:', rows[0]);
console.log('--- Samples ---');
rows.slice(1, 20).forEach((r, idx) => {
  console.log(`[${idx+1}] Name: ${r[0]?.replace(/\n/g, ' ')} | Coord: "${r[1]}"`);
});
