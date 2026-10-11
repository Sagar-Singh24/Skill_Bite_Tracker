const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const mapping = [
  // Hex mappings (teal dark -> neon dark)
  { regex: /#222831/gi, replacement: '#0a0a0a' },
  { regex: /#393E46/gi, replacement: '#1a1a1a' },
  { regex: /#948979/gi, replacement: '#333333' },
  { regex: /#DFD0B8/gi, replacement: '#ffffff' },

  // rgb mappings
  { regex: /rgba?\(\s*34,\s*40,\s*49/g, replacement: 'rgba(10, 10, 10' }, // bg
  { regex: /rgba?\(\s*57,\s*62,\s*70/g, replacement: 'rgba(26, 26, 26' }, // surface
  { regex: /rgba?\(\s*148,\s*137,\s*121/g, replacement: 'rgba(51, 51, 51' }, // neutral border
  { regex: /rgba?\(\s*223,\s*208,\s*184/g, replacement: 'rgba(255, 255, 255' }, // text light
];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(js|jsx|css|html)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let updated = content;
      for (const rule of mapping) {
        updated = updated.replace(rule.regex, rule.replacement);
      }

      if (content !== updated) {
        fs.writeFileSync(fullPath, updated);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Successfully polished the Neon dark theme across all React files.');
