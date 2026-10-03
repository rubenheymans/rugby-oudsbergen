#!/usr/bin/env node
import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const dir = process.argv[2] || '.';
const quality = parseInt(process.argv[3] || '80');
const keepOriginals = process.argv.includes('--keep');
const extensions = ['.png', '.jpg', '.jpeg'];

const files = (await readdir(dir)).filter(f => extensions.includes(extname(f).toLowerCase()));

if (!files.length) {
  console.log(`No images found in ${dir}`);
  process.exit(0);
}

let totalBefore = 0, totalAfter = 0;

for (const file of files) {
  const input = join(dir, file);
  const output = join(dir, basename(file, extname(file)) + '.webp');

  await sharp(input).webp({ quality }).toFile(output);

  const before = (await stat(input)).size;
  const after = (await stat(output)).size;
  const saved = Math.round((1 - after / before) * 100);
  totalBefore += before;
  totalAfter += after;

  console.log(`${file} → ${basename(output)}  ${(before/1024)|0}KB → ${(after/1024)|0}KB  (-${saved}%)`);

  if (!keepOriginals) {
    await unlink(input);
  }
}

console.log(`\nDone: ${files.length} images → WebP (q=${quality})${keepOriginals ? '' : ' — originals deleted'}`);
console.log(`Total: ${(totalBefore/1024)|0}KB → ${(totalAfter/1024)|0}KB  (-${Math.round((1 - totalAfter/totalBefore) * 100)}%)`);
console.log(`\nUsage: node tools/compress-images.mjs <dir> [quality] [--keep]`);
