const fs = require('fs');

const parsedExcels = JSON.parse(fs.readFileSync('scripts/parsed_ref_excels.json', 'utf8'));
const { allMonumentsList } = require('../src/data/allMonumentsData.js');

// Collect all rows from 3 sheets
const allExcelRows = [];
Object.keys(parsedExcels).forEach(sheetName => {
  const rows = parsedExcels[sheetName];
  rows.slice(1).forEach(r => {
    if (r[1] && r[1].trim()) {
      allExcelRows.push({
        sheet: sheetName,
        code: r[0] || '',
        name: r[1].trim(),
        type: r[2] || '',
        citations: r[3] || '',
        webLink: r[6] || '',
        bookLinks: r[7] || ''
      });
    }
  });
});

console.log(`Total reference rows in 3 sheets: ${allExcelRows.length}`);

function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
}

// Match each of 103 monuments
const matchedRefs = {};

allMonumentsList.forEach(m => {
  const normM = normalize(m.info.name);
  let bestMatch = null;
  let bestScore = 0;

  for (const r of allExcelRows) {
    const normR = normalize(r.name);
    if (normM.includes(normR) || normR.includes(normM)) {
      bestMatch = r;
      break;
    }
    // Check partial words
    const wordsM = m.info.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    let matchWords = 0;
    for (const w of wordsM) {
      if (r.name.toLowerCase().includes(w)) matchWords++;
    }
    if (matchWords > bestScore && matchWords >= 2) {
      bestScore = matchWords;
      bestMatch = r;
    }
  }

  matchedRefs[m.stt] = {
    stt: m.stt,
    monumentName: m.info.name,
    refRow: bestMatch
  };
});

let matchedCount = 0;
allMonumentsList.forEach(m => {
  const ref = matchedRefs[m.stt];
  if (ref.refRow) {
    matchedCount++;
  } else {
    console.log(`Unmatched STT ${m.stt}: ${m.info.name}`);
  }
});

console.log(`Matched ${matchedCount} / ${allMonumentsList.length} monuments with detailed references from Drive!`);

for (let i = 1; i <= 5; i++) {
  console.log(`\n--- STT ${i}: ${allMonumentsList[i-1].info.name} ---`);
  console.log(matchedRefs[i].refRow);
}
