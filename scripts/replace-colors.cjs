const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.css') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace #000 with var(--secondary-color) when it's a color
      content = content.replace(/color:\s*#000000;/g, 'color: var(--secondary-color);');
      content = content.replace(/color:\s*#000;/g, 'color: var(--secondary-color);');
      content = content.replace(/color:\s*'#000'/g, "color: 'var(--secondary-color)'");

      // Replace background #000 with var(--primary-color)
      content = content.replace(/background:\s*#000;/g, 'background: var(--primary-color);');
      content = content.replace(/background-color:\s*#000;/g, 'background-color: var(--primary-color);');

      // Replace rgba(0, 0, 0, with rgba(5, 18, 41, (dark bg)
      content = content.replace(/rgba\(0,\s*0,\s*0,/g, 'rgba(5, 18, 41,');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(srcDir);
console.log('Done replacing colors.');
