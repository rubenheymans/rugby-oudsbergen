import { GoogleGenAI } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse args
const args = process.argv.slice(2);
const removeBgFlag = args.includes('--remove-bg');
const bgColorIdx = args.indexOf('--bg-color');
const bgColor = bgColorIdx !== -1 ? args[bgColorIdx + 1] : '#FFFFFF';
const tolerance = (() => { const i = args.indexOf('--tolerance'); return i !== -1 ? parseInt(args[i + 1]) : 20; })();
const positional = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1]?.startsWith('--')));
const prompt = positional[0];
const outputPath = positional[1];
const aspectRatio = positional[2] || '16:9';

if (!prompt || !outputPath) {
  console.error(`Usage: node tools/generate-image.mjs "<prompt>" <output-path> [aspect-ratio] [--remove-bg] [--bg-color '#HEX'] [--tolerance N]

Examples:
  node tools/generate-image.mjs "Professional photo of a worker" previews/hero.webp
  node tools/generate-image.mjs "Logo icon mark" previews/logo.png 1:1 --remove-bg
  node tools/generate-image.mjs "Logo on dark bg" previews/logo.png 1:1 --remove-bg --bg-color '#090A07' --tolerance 25

Output is WebP by default. With --remove-bg, output is PNG with transparency.
--remove-bg: Remove solid background color and crop tight to content.
--bg-color: Background color to remove (default: #FFFFFF).
--tolerance: Color matching tolerance 0-255 (default: 20).
Aspect ratios: 16:9 (default, hero/wide), 4:3 (cards), 1:1 (square/gallery), 3:4 (portrait)
Model: gemini-3.1-flash-image-preview (Nano Banana 2)`);
  process.exit(1);
}

const ai = new GoogleGenAI({});

console.log(`Generating image...`);
console.log(`  Prompt: "${prompt}"`);
console.log(`  Aspect ratio: ${aspectRatio}`);
console.log(`  Output: ${outputPath}`);

try {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: prompt,
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
      },
    },
  });

  let saved = false;
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const rawBuffer = Buffer.from(part.inlineData.data, 'base64');
      let fullPath = resolve(outputPath);
      mkdirSync(dirname(fullPath), { recursive: true });

      if (removeBgFlag) {
        // Remove background and save as PNG with transparency
        const { data, info } = await sharp(rawBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        const bg = [
          parseInt(bgColor.slice(1, 3), 16),
          parseInt(bgColor.slice(3, 5), 16),
          parseInt(bgColor.slice(5, 7), 16),
        ];
        // Make matching pixels transparent
        for (let i = 0; i < data.length; i += 4) {
          if (Math.abs(data[i] - bg[0]) < tolerance &&
              Math.abs(data[i + 1] - bg[1]) < tolerance &&
              Math.abs(data[i + 2] - bg[2]) < tolerance) {
            data[i + 3] = 0; // alpha = 0
          }
        }
        // Trim transparent pixels
        const trimmed = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
          .trim()
          .png()
          .toBuffer();
        if (!fullPath.endsWith('.png')) fullPath = fullPath.replace(/\.\w+$/, '.png');
        writeFileSync(fullPath, trimmed);
        const sizeKB = (trimmed.length / 1024).toFixed(1);
        console.log(`Saved image to ${fullPath} (${sizeKB} KB, transparent)`);
      } else {
        // Standard: save as webp
        if (fullPath.endsWith('.png')) fullPath = fullPath.replace(/\.png$/, '.webp');
        const webpBuffer = await sharp(rawBuffer).webp({ quality: 80 }).toBuffer();
        writeFileSync(fullPath, webpBuffer);
        const sizeKB = (webpBuffer.length / 1024).toFixed(1);
        console.log(`Saved image to ${fullPath} (${sizeKB} KB)`);
      }
      saved = true;
      break;
    }
  }

  if (!saved) {
    console.error('No image data in response');
    console.error('Response text:', response.candidates[0].content.parts.map(p => p.text).filter(Boolean).join('\n'));
    process.exit(1);
  }
} catch (err) {
  console.error('Error generating image:', err.message);
  process.exit(1);
}
