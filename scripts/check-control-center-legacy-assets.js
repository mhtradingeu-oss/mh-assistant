const fs = require('fs');
const path = require('path');
const SCAN_PATHS = ['public/control-center/index.html','public/control-center/app.js','public/control-center/router.js','public/control-center/pages','public/control-center/ui','public/control-center/styles'];
const FORBIDDEN_PATTERNS = [/public\/control-center\/legacy\//, /\.\/legacy\//, /\.\.\/legacy\//, /legacy\/.*\.css/, /legacy\/.*\.js/, /styles\.legacy/, /page-standard\.legacy/, /integrations\.monolith/];
function scanFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) { return fs.readdirSync(filePath).flatMap(file => scanFile(path.join(filePath, file))); }
    if (filePath.includes('public/control-center/legacy/')) return [];
    if (!/\.(js|html|css)$/.test(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const findings = [];
    lines.forEach((line, index) => {
      FORBIDDEN_PATTERNS.forEach(pattern => { if (pattern.test(line)) { findings.push({ file: filePath, line: index + 1, text: line.trim(), pattern: pattern.toString() }); } });
    });
    return findings;
  } catch (err) { return []; }
}
let allFindings = [];
SCAN_PATHS.forEach(p => { const fullPath = path.resolve(process.cwd(), p); if (fs.existsSync(fullPath)) { allFindings = allFindings.concat(scanFile(fullPath)); } });
if (allFindings.length === 0) { console.log('PASS: No legacy asset references found in active Control Center paths.'); process.exit(0); } else { console.error('FAIL: Legacy asset references found:'); allFindings.forEach(f => { console.error(`${f.file}:${f.line}: ${f.text} (Matched: ${f.pattern})`); }); process.exit(1); }
