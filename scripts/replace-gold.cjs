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
      
      // Replace fallback colors with just the variables or replace the hex directly
      content = content.replace(/#e5b869/gi, 'var(--gold-accent)');
      content = content.replace(/#f3c77c/gi, 'var(--gold-hover)');
      content = content.replace(/#c49a4f/gi, 'var(--gold-hover)');
      
      // Some properties might become var(--gold-accent, var(--gold-accent))
      content = content.replace(/var\(--gold-accent, var\(--gold-accent\)\)/g, 'var(--gold-accent)');
      content = content.replace(/var\(--gold-hover, var\(--gold-hover\)\)/g, 'var(--gold-hover)');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(srcDir);
console.log('Done replacing old gold colors.');
