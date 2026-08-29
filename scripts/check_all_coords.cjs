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
const dataRows = rows.slice(1).filter(r => r[0] && r[0].trim());

console.log('Total monuments in coordinates sheet:', dataRows.length);
let validCount = 0;
dataRows.forEach((r, idx) => {
  const name = r[0].trim().replace(/\s+/g, ' ');
  const coordStr = (r[1] || '').trim();
  const parts = coordStr.split(',').map(s => parseFloat(s.trim()));
  const isValid = parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1]);
  if (isValid) {
    validCount++;
  } else {
    console.log(`[${idx+1}] Invalid coord for "${name}": "${coordStr}"`);
  }
});
console.log(`Valid coordinates: ${validCount} / ${dataRows.length}`);
