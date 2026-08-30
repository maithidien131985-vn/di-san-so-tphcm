const https = require('https');
const fs = require('fs');
const path = require('path');

const dinhDocLapIds = [
  '1q_aBHuSlGvZug6slnTOwQs6yCCGmlhl-',
  '1FUoXOQm8Dh0fwXR25qLdqQMVaIi-xwzQ',
  '1WhwBCJ-O5tz0Nv7WIKkuE0D2vzc6BBRC',
  '1nz-TiqtWiXtF-7f3XO9YVk0rvIIoTk_e',
  '1ykXZjthH24WVqAnP4eB-gp63yENwn8K4',
  '1v7B98jk9VUaPKRE-W110mxwrZhc3P05Q',
  '1w0mIzXKeAbg3clAadaO4ZIIE4iQQxcJX',
  '1KR_KPmT-ZpXYQt--vwa0BuuC22dwjQ5X',
  '1C3LkrDUBObjNsW7LoP-CmmcCbEVnXLPH',
  '1g9kmGz5MHXxFNRBsTOv8wZthVTHpjtl3'
];

const diaDaoCuChiIds = [
  '14VS16iAgFmCVImYzoYMtJBnFMTyxfZss',
  '1gxNs8Zph9pvF1lX55Ic5oJOpqMYTeBGr',
  '1Q7y9OiYceGsxc4luVn-mfPNbfmIbR6hC',
  '1aK6U4Bm-1FAlZQKqdyxlRm6-C7VnHmvt',
  '1sUltQqDdDH9Dkbpzl1VxnXMhTV-F1wte',
  '1tI2OcR8qAxMI32x71YdKC4dbZQQL20oE',
  '1R-TXpuJVevyzdVuiaQFE6rxGwikkOSSg',
  '1gwAKijYckZkYdkARjnY_bnThWKN8q2HQ',
  '1rW7j-qnUzWezBhcEJ07uDZqFU2s-Hq5N',
  '1PQ2HVJzl_C-j3_-WI6zVvYUBJFIJ0toa'
];

function downloadDriveFile(fileId, destPath) {
  return new Promise((resolve) => {
    // Try download URL with redirect handling
    const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0&confirm=t`;
    
    function makeReq(curUrl, depth = 0) {
      if (depth > 5) {
        console.error(`Too many redirects for ${fileId}`);
        return resolve(false);
      }
      https.get(curUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return makeReq(res.headers.location, depth + 1);
        }
        if (res.statusCode !== 200) {
          console.error(`Failed ${fileId} with status ${res.statusCode}`);
          return resolve(false);
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const stat = fs.statSync(destPath);
          console.log(`Downloaded ${fileId} -> ${destPath} (${(stat.size / 1024).toFixed(1)} KB)`);
          resolve(true);
        });
      }).on('error', (err) => {
        console.error(`Error downloading ${fileId}:`, err.message);
        resolve(false);
      });
    }

    makeReq(url);
  });
}

async function run() {
  const dinhDir = path.join(__dirname, '../public/assets/images/dinh-doc-lap');
  const cuchiDir = path.join(__dirname, '../public/assets/images/dia-dao-cu-chi');
  fs.mkdirSync(dinhDir, { recursive: true });
  fs.mkdirSync(cuchiDir, { recursive: true });

  console.log('Downloading Dinh Doc Lap images...');
  for (let i = 0; i < dinhDocLapIds.length; i++) {
    const fileId = dinhDocLapIds[i];
    const dest = path.join(dinhDir, `dinh-doc-lap-${i + 1}.jpg`);
    await downloadDriveFile(fileId, dest);
  }

  console.log('Downloading Dia Dao Cu Chi images...');
  for (let i = 0; i < diaDaoCuChiIds.length; i++) {
    const fileId = diaDaoCuChiIds[i];
    const dest = path.join(cuchiDir, `dia-dao-cu-chi-${i + 1}.jpg`);
    await downloadDriveFile(fileId, dest);
  }
}

run();
