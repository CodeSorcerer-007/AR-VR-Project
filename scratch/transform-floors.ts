import * as fs from 'fs';
import * as path from 'path';

// Horizontal inversion: x_new = -x_old, swap doorSwing left <-> right
const floorsDir = path.resolve('src/config/floors');
const files = fs.readdirSync(floorsDir).filter((f) => f.endsWith('.ts'));

console.log(`Processing ${files.length} floor files in ${floorsDir}...`);

for (const file of files) {
  const filePath = path.join(floorsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace position: [x, y, z]
  content = content.replace(
    /position:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g,
    (_, x, y, z) => {
      const oldX = parseFloat(x);
      const newX = oldX === 0 ? 0 : Math.round(-oldX * 100) / 100;
      return `position: [${newX}, ${y}, ${z}]`;
    }
  );

  // Replace doorPosition: [x, y, z]
  content = content.replace(
    /doorPosition:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g,
    (_, x, y, z) => {
      const oldX = parseFloat(x);
      const newX = oldX === 0 ? 0 : Math.round(-oldX * 100) / 100;
      return `doorPosition: [${newX}, ${y}, ${z}]`;
    }
  );

  // Invert doorSwing
  content = content
    .replace(/doorSwing:\s*'left'/g, "doorSwing: '__SWAP_RIGHT__'")
    .replace(/doorSwing:\s*'right'/g, "doorSwing: 'left'")
    .replace(/doorSwing:\s*'__SWAP_RIGHT__'/g, "doorSwing: 'right'");

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Transformed ${file}`);
}
console.log('Done transforming floor files.');
