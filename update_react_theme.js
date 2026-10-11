const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const publicDir = path.join(__dirname, 'frontend', 'public');
const htmlFile = path.join(__dirname, 'frontend', 'index.html');

const MAROON = '67, 35, 35';
const MAROON_HEX = '#432323';
const DARK_TEAL = '47, 87, 85';
const DARK_TEAL_HEX = '#2F5755';
const MED_TEAL = '90, 150, 144';
const MED_TEAL_HEX = '#5A9690';
const LIGHT_GRAY = '224, 217, 217';
const LIGHT_GRAY_HEX = '#E0D9D9';

const hexMap = {
    '#05080c': MAROON_HEX,
    '#0c1822': MAROON_HEX,
    '#7eb8c8': MED_TEAL_HEX,
    '#a8d4e6': MED_TEAL_HEX,
    '#c9a968': MED_TEAL_HEX,
    '#8b5a4a': MAROON_HEX,
    '#0e141c': MAROON_HEX,
    '#d8e2ea': LIGHT_GRAY_HEX,
    '#e8eef2': LIGHT_GRAY_HEX,
    '#7a9aa8': LIGHT_GRAY_HEX,
    '#2d4a5a': DARK_TEAL_HEX,
    '#1a3040': DARK_TEAL_HEX,
    '#6b4a3a': MAROON_HEX,
    '#f0f4f8': LIGHT_GRAY_HEX,
    '#1e3545': DARK_TEAL_HEX,
    '#2a1c22': MAROON_HEX,
    '#c8d8e4': LIGHT_GRAY_HEX,
    '#d8e8f0': LIGHT_GRAY_HEX,
    '#a8c4d0': LIGHT_GRAY_HEX,
    '#1a3a4a': DARK_TEAL_HEX,
    '#2a1820': MAROON_HEX,
    '#142830': DARK_TEAL_HEX,
};

const rgbMap = [
    { regex: /rgba?\(\s*6,\s*8,\s*16/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*8,\s*10,\s*18/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*2,\s*4,\s*10/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*5,\s*7,\s*12/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*4,\s*6,\s*12/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*6,\s*9,\s*14/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*4,\s*6,\s*10/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*8,\s*12,\s*22/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*5,\s*8,\s*12/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*4,\s*5,\s*8/g, replacement: `rgba(${MAROON}` },

    { regex: /rgba?\(\s*10,\s*14,\s*22/g, replacement: `rgba(${DARK_TEAL}` },
    { regex: /rgba?\(\s*6,\s*10,\s*16/g, replacement: `rgba(${DARK_TEAL}` },
    { regex: /rgba?\(\s*8,\s*12,\s*18/g, replacement: `rgba(${DARK_TEAL}` },
    { regex: /rgba?\(\s*20,\s*35,\s*48/g, replacement: `rgba(${DARK_TEAL}` },
    { regex: /rgba?\(\s*15,\s*22,\s*32/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*20,\s*40,\s*55/g, replacement: `rgba(${DARK_TEAL}` },
    { regex: /rgba?\(\s*35,\s*25,\s*40/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*8,\s*12,\s*20/g, replacement: `rgba(${MAROON}` },
    { regex: /rgba?\(\s*45,\s*75,\s*90/g, replacement: `rgba(${DARK_TEAL}` },
    { regex: /rgba?\(\s*30,\s*45,\s*58/g, replacement: `rgba(${DARK_TEAL}` },

    { regex: /rgba?\(\s*74,\s*120,\s*140/g, replacement: `rgba(${MED_TEAL}` },
    { regex: /rgba?\(\s*126,\s*184,\s*200/g, replacement: `rgba(${MED_TEAL}` },
    { regex: /rgba?\(\s*60,\s*90,\s*105/g, replacement: `rgba(${MED_TEAL}` },
    { regex: /rgba?\(\s*120,\s*60,\s*45/g, replacement: `rgba(${MED_TEAL}` },
    { regex: /rgba?\(\s*180,\s*100,\s*80/g, replacement: `rgba(${MED_TEAL}` },
    { regex: /rgba?\(\s*60,\s*100,\s*120/g, replacement: `rgba(${MED_TEAL}` },
    { regex: /rgba?\(\s*160,\s*195,\s*210/g, replacement: `rgba(${LIGHT_GRAY}` },

    { regex: /rgba?\(\s*94,\s*168,\s*190/g, replacement: `rgba(${MED_TEAL}` },
    { regex: /rgba?\(\s*201,\s*169,\s*104/g, replacement: `rgba(${MED_TEAL}` },
    { regex: /rgba?\(\s*90,\s*138,\s*156/g, replacement: `rgba(${MED_TEAL}` },
];

function applyTheme(text) {
    let newText = text;
    for(const rule of rgbMap) {
        newText = newText.replace(rule.regex, rule.replacement);
    }
    for (const [oldHex, newHex] of Object.entries(hexMap)) {
        const re = new RegExp(oldHex, 'gi');
        newText = newText.replace(re, newHex);
    }
    newText = newText.replace(/text-gray-500/g, 'text-[#E0D9D9]/70');
    newText = newText.replace(/text-gray-400/g, 'text-[#E0D9D9]/80');
    newText = newText.replace(/text-gray-100/g, 'text-[#E0D9D9]');
    return newText;
}

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (/\.(js|jsx|css|html)$/.test(file)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const updated = applyTheme(content);
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated);
            }
        }
    }
}

processDirectory(srcDir);
if (fs.existsSync(htmlFile)) {
    let content = fs.readFileSync(htmlFile, 'utf8');
    fs.writeFileSync(htmlFile, applyTheme(content));
}

console.log('Successfully updated the frontend theme files.');
