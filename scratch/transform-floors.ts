import * as fs from 'fs';
import * as path from 'path';

// This script safely reads each floor file in src/config/floors/,
// transforms positions and doorPositions using x_new = -21 - x_old,
// and adjusts doorSwing (left <-> right) for front/rear walls.

const floorsDir = path.resolve(process.cwd(), 'src/config/floors');
const files = fs.readdirSync(floorsDir).filter(f => f.endsWith('.ts'));

console.log(`Found ${files.length} floor files in ${floorsDir}`);

for (const file of files) {
  const filePath = path.join(floorsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Regex to replace position: [x, y, z]
  content = content.replace(/position:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g, (match, x, y, z) => {
    const oldX = parseFloat(x);
    const newX = Math.round((-21 - oldX) * 100) / 100;
    return `position: [${newX}, ${y}, ${z}]`;
  });

  // Regex to replace doorPosition: [x, y, z]
  content = content.replace(/doorPosition:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g, (match, x, y, z) => {
    const oldX = parseFloat(x);
    const newX = Math.round((-21 - oldX) * 100) / 100;
    return `doorPosition: [${newX}, ${y}, ${z}]`;
  });

  // Invert doorSwing
  content = content.replace(/doorSwing:\s*'left'/g, "doorSwing: '__SWAP_RIGHT__'")
                   .replace(/doorSwing:\s*'right'/g, "doorSwing: 'left'")
                   .replace(/doorSwing:\s*'__SWAP_RIGHT__'/g, "doorSwing: 'right'");

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
