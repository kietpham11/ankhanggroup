const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/var\(--bg-color,\s*#0d0d0d\)/g, 'var(--primary-color)');
      content = content.replace(/var\(--card-bg,\s*#1a1a1a\)/g, 'var(--card-bg)');
      content = content.replace(/rgba\(20,\s*20,\s*20,/g, 'rgba(10, 29, 66,');
      content = content.replace(/rgba\(13,\s*13,\s*13,/g, 'rgba(5, 18, 41,');
      content = content.replace(/rgba\(30,\s*30,\s*30,/g, 'rgba(11, 34, 79,');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(dir);
console.log('Replaced dark grays with navy variants in components.');
