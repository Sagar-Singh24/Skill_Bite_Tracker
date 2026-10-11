const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const mapping = [
  // Hex mappings (old maroon/teal -> new linear dark)
  { regex: /#432323/gi, replacement: '#222831' },
  { regex: /#2F5755/gi, replacement: '#393E46' },
  { regex: /#5A9690/gi, replacement: '#948979' },
  { regex: /#E0D9D9/gi, replacement: '#DFD0B8' },
  
  // RGB mappings (old maroon/teal rgb -> new linear dark rgb)
  { regex: /rgba?\(\s*67,\s*35,\s*35/g, replacement: 'rgba(34, 40, 49' }, // Maroon
  { regex: /rgba?\(\s*47,\s*87,\s*85/g, replacement: 'rgba(57, 62, 70' }, // Dark Teal
  { regex: /rgba?\(\s*90,\s*150,\s*144/g, replacement: 'rgba(148, 137, 121' }, // Med Teal
  { regex: /rgba?\(\s*224,\s*217,\s*217/g, replacement: 'rgba(223, 208, 184' }, // Light Gray

  // Other explicit hex codes seen in DailyPage remaining
  { regex: /#355466/gi, replacement: '#948979' }, 
  { regex: /#0a121a/gi, replacement: '#222831' },
  { regex: /#132331/gi, replacement: '#393E46' },
  { regex: /#b8e6c6/gi, replacement: '#DFD0B8' },
  { regex: /#7a9aaa/gi, replacement: '#948979' },
  { regex: /#c8e4f0/gi, replacement: '#DFD0B8' },
  { regex: /#3b2b1f/gi, replacement: '#393E46' },
  { regex: /#4a3423/gi, replacement: '#948979' },

  // Tailwind generic class text colors
  { regex: /text-gray-300/gi, replacement: 'text-[#DFD0B8]/80' },
  { regex: /text-gray-200/gi, replacement: 'text-[#DFD0B8]/90' },
  { regex: /text-gray-400/gi, replacement: 'text-[#DFD0B8]/70' },
  
  // Replace old .glass-card with generic Tailwind classes that use our new config
  // (We defined .glass-card in index.css, so inline styles in DailyPage overriding it need cleanup - though mapping the rgb works too)
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
console.log('Successfully polished the deep dark theme across all React files.');
