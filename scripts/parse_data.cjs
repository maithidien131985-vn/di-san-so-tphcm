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

const csv = fs.readFileSync('D:/KHKT/google_sheet_data.csv', 'utf8');
const rows = parseCSV(csv);
console.log('Total parsed rows (including header):', rows.length);
console.log('Headers:', rows[0]);

const dataRows = rows.slice(1).filter(r => r[0] && r[0].trim() && !isNaN(parseInt(r[0].trim())));
console.log('Total valid data rows:', dataRows.length);
dataRows.forEach((r, idx) => {
  if (idx < 15 || idx >= dataRows.length - 5) {
    console.log(`[${r[0]}] ${(r[2] || '').slice(0, 50)} | Type: ${r[3]} | Rank: ${r[4]}`);
  }
});
