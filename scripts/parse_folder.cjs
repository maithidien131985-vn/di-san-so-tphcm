const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'folder_page.html'), 'utf8');

// Look for data blobs in script tags
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
console.log('Total script tags:', scripts.length);

const foundItems = [];

// Scan all script contents
for (let i = 0; i < scripts.length; i++) {
  const s = scripts[i];
  if (s.includes('AF_initDataCallback')) {
    // Extract JSON-like array from data:function(){return [...]}}
    const match = s.match(/data:\s*function\(\)\s*\{\s*return\s*([\s\S]+?)\s*\}\s*,\s*sideChannel/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        fs.writeFileSync(path.join(__dirname, `initdata_${i}.json`), JSON.stringify(parsed, null, 2), 'utf8');
        console.log(`Saved parsed data for script ${i}`);
      } catch (e) {
        // Find strings inside
        const strings = match[1].match(/"([^"]{3,})"/g) || [];
        console.log(`Script ${i} has ${strings.length} strings`);
      }
    }
  }
}

// Search for any Google Drive file ID pattern
const idRegex = /"(1[a-zA-Z0-9_-]{25,35})"/g;
const ids = new Set();
let m;
while ((m = idRegex.exec(html)) !== null) {
  ids.add(m[1]);
}
console.log('Detected Drive IDs:', [...ids]);
