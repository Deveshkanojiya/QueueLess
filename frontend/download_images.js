const fs = require('fs');
const path = require('path');
const https = require('https');

const destDir = '/home/devesh/Desktop/QueueLess/frontend/src/assets/menu';

const downloads = {
  'veg-burger.png': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1024&h=1024&fit=crop&fm=png&q=80',
  'cheese-burger.png': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1024&h=1024&fit=crop&fm=png&q=80',
  'peri-peri-fries.png': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=1024&h=1024&fit=crop&fm=png&q=80',
  'vada-pav.png': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1024&h=1024&fit=crop&fm=png&q=80',
  'pav-bhaji.png': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=1024&h=1024&fit=crop&fm=png&q=80',
  'garlic-bread.png': 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=1024&h=1024&fit=crop&fm=png&q=80',
  'masala-chai.png': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1024&h=1024&fit=crop&fm=png&q=80',
  'hot-coffee.png': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1024&h=1024&fit=crop&fm=png&q=80',
  'cold-coffee.png': 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=1024&h=1024&fit=crop&fm=png&q=80',
  'chocolate-pastry.png': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1024&h=1024&fit=crop&fm=png&q=80',
  'vanilla-ice-cream.png': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1024&h=1024&fit=crop&fm=png&q=80'
};

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function main() {
  for (const [filename, url] of Object.entries(downloads)) {
    const destPath = path.join(destDir, filename);
    try {
      console.log(`Downloading ${filename}...`);
      await downloadFile(url, destPath);
      console.log(`Success: ${filename}`);
    } catch (err) {
      console.error(`Error downloading ${filename}:`, err.message);
    }
  }
  console.log("All downloads completed!");
}

main();
