const fs = require('fs');
const text = fs.readFileSync('scripts/callbacks.txt', 'utf8');

const idRegex = /"(1[a-zA-Z0-9_-]{28,34})"/g;
const allIds = [];
let m;
while ((m = idRegex.exec(text)) !== null) {
  if (!allIds.includes(m[1]) && m[1] !== '1FZc-1NfRdcOMAFn-MxjSL2wEl8JrtNvT') {
    allIds.push(m[1]);
  }
}
console.log('All Drive IDs found in callbacks:', allIds);

allIds.forEach(id => {
  const pos = text.indexOf(id);
  console.log('ID:', id);
  console.log('CONTEXT:', text.slice(Math.max(0, pos - 80), pos + 120));
  console.log('-----------------------------------');
});
