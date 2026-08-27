const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        if (file === 'node_modules' || file === 'vendor' || file === '.git' || file === 'dist') return;
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.html') || file.endsWith('.php') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('d:/laragon/www/exim');
let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Case sensitive replacements
    content = content.replace(/padmeshwara/g, 'padmeshwara');
    content = content.replace(/padmeshwara\.com/g, 'abcexport.com');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        replacedCount++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`Total files updated: ${replacedCount}`);
