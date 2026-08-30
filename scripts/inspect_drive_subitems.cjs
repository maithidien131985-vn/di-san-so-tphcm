const https = require('https');
const fs = require('fs');
const path = require('path');

const ids = [
  '1dnjwfAMlouC-WxA6aK2ELiJth0BC-lLT',
  '1JJe3_veLDUrkq_jm2GrZOJTwYzs12v8d'
];

async function inspectId(id) {
  const url = `https://drive.google.com/drive/folders/${id}`;
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find title
        const titleMatch = data.match(/<title>([^<]+)<\/title>/);
        const ogTitle = data.match(/<meta property="og:title" content="([^"]+)"/);
        console.log(`[ID ${id}] Title:`, titleMatch ? titleMatch[1] : 'No title', 'OG Title:', ogTitle ? ogTitle[1] : 'None');
        fs.writeFileSync(path.join(__dirname, `subfolder_${id}.html`), data, 'utf8');
        
        // Find all drive IDs in this page
        const idRegex = /"(1[a-zA-Z0-9_-]{25,35})"/g;
        const subIds = new Set();
        let m;
        while ((m = idRegex.exec(data)) !== null) {
          subIds.add(m[1]);
        }
        console.log(`[ID ${id}] Sub IDs:`, [...subIds]);
        resolve({ id, title: ogTitle ? ogTitle[1] : (titleMatch ? titleMatch[1] : ''), subIds: [...subIds] });
      });
    }).on('error', err => {
      console.error('Error on id', id, err);
      resolve(null);
    });
  });
}

async function run() {
  for (const id of ids) {
    await inspectId(id);
  }
}
run();
