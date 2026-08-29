const fs = require('fs');
const path = require('path');

const d1 = fs.readFileSync(path.join(__dirname, '../doc1.txt'), 'utf8');
const d2 = fs.readFileSync(path.join(__dirname, '../doc2.txt'), 'utf8');
const d3 = fs.readFileSync(path.join(__dirname, '../doc3.txt'), 'utf8');

// Combine text with clear markers
function getDocumentContent(stt) {
  // Check doc2 (1 to 4)
  // Check doc1 (5 to 55)
  // Check doc3 (56 to 103)
  const fullText = d2 + '\n\n' + d1 + '\n\n' + d3;
  
  // Search for pattern like "\n1. ", "\n2. ", "\n56. "
  const startPattern = new RegExp('(?:^|\\n)\\s*' + stt + '\\.\\s*([^\\n]+)');
  const nextPattern = new RegExp('(?:^|\\n)\\s*' + (stt + 1) + '\\.\\s*[^\\n]+');
  
  const startMatch = fullText.match(startPattern);
  if (!startMatch) return null;
  
  const startIndex = startMatch.index;
  const title = startMatch[1].trim();
  const subStr = fullText.slice(startIndex + startMatch[0].length);
  
  const nextMatch = subStr.match(nextPattern);
  const content = nextMatch ? subStr.slice(0, nextMatch.index) : subStr.slice(0, 5000);
  
  return { title, content: content.trim() };
}

let foundCount = 0;
for (let i = 1; i <= 103; i++) {
  const res = getDocumentContent(i);
  if (res) {
    foundCount++;
    if (i <= 5 || (i >= 55 && i <= 60) || i >= 100) {
      console.log(`[STT ${i}] Title: "${res.title.slice(0, 40)}" | Len: ${res.content.length}`);
    }
  } else {
    console.log(`[STT ${i}] NOT FOUND directly by regex`);
  }
}
console.log(`Successfully found: ${foundCount} / 103 monuments directly from docs!`);
