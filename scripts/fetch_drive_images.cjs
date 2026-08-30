const https = require('https');
const fs = require('fs');
const path = require('path');

const folderId = '1xBiey6IhHuwi4CKf6nj7QMg5Wy9VDpAL';
const url = `https://drive.google.com/drive/folders/${folderId}`;

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Fetched HTML length:', data.length);
    fs.writeFileSync(path.join(__dirname, 'folder_page.html'), data, 'utf8');
    
    // Parse items inside Drive
    // Google Drive embeds item data in JSON or JS scripts:
    const fileMatches = [...data.matchAll(/\["([a-zA-Z0-9_-]{25,})",\["([^"]+)"/g)];
    console.log(`Found ${fileMatches.length} raw matches`);
    
    // Also look for image names and IDs
    const allIds = [...data.matchAll(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/g)];
    console.log(`Found direct file links: ${allIds.length}`);

    // Search for jpg/png/heic/jpeg
    const imageNames = [...data.matchAll(/"([^"]+\.(?:jpg|jpeg|png|webp|JPG|PNG))"/g)];
    console.log('Image names found:', imageNames.map(m => m[1]));
  });
}).on('error', err => {
  console.error('Error fetching drive folder:', err);
});
