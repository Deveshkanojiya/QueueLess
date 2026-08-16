const fs = require('fs');
const path = require('path');

const srcDir = '/home/devesh/.gemini/antigravity/brain/92ee80e0-a637-4bda-92ea-dd19e3287344';
const destDir = '/home/devesh/Desktop/QueueLess/frontend/src/assets/menu';

const filesToCopy = {
  'veg_burger_1786868950232.png': 'veg-burger.png',
  'cheese_burger_1786869117801.png': 'cheese-burger.png',
  'peri_peri_fries_1786869976250.png': 'peri-peri-fries.png',
  'vada_pav_1786870020965.png': 'vada-pav.png',
  'pav_bhaji_1786870087796.png': 'pav-bhaji.png',
  'garlic_bread_1786870104476.png': 'garlic-bread.png',
  'masala_chai_1786870197226.png': 'masala-chai.png',
  'hot_coffee_1786870214935.png': 'hot-coffee.png',
  'cold_coffee_1786870232977.png': 'cold-coffee.png',
  'chocolate_pastry_1786870344767.png': 'chocolate-pastry.png',
  'vanilla_ice_cream_1786870629407.png': 'vanilla-ice-cream.png'
};

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

Object.entries(filesToCopy).forEach(([srcFile, destFile]) => {
  const srcPath = path.join(srcDir, srcFile);
  const destPath = path.join(destDir, destFile);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcFile} to ${destFile}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});
console.log('Done copying all assets!');
