import { GoogleGenAI } from '@google/genai';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));

const sourcePath = process.argv[2];
const prompt = process.argv[3];
const outputPath = process.argv[4];

if (!sourcePath || !prompt || !outputPath) {
  console.error(`Usage: node tools/edit-image.mjs <source-image> "<edit-prompt>" <output-path>

Examples:
  node tools/edit-image.mjs images/clean-roof.webp "Make this roof look dirty, covered in moss and algae" images/dirty-roof.webp
  node tools/edit-image.mjs images/garden-after.webp "Make this garden look neglected and overgrown" images/garden-before.webp

Takes a source image and applies an edit prompt via Gemini image editing.
Output is always WebP (quality 80).`);
  process.exit(1);
}

const ai = new GoogleGenAI({});

console.log(`Editing image...`);
console.log(`  Source: ${sourcePath}`);
console.log(`  Prompt: "${prompt}"`);
console.log(`  Output: ${outputPath}`);

try {
  // Read source image and convert to PNG base64 for the API
  const sourceBuffer = readFileSync(resolve(sourcePath));
  const pngBuffer = await sharp(sourceBuffer).png().toBuffer();
  const base64Image = pngBuffer.toString('base64');

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    config: {
      imageConfig: {
        numberOfImages: 1,
      },
    },
  });

  let saved = false;
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const resultBuffer = Buffer.from(part.inlineData.data, 'base64');
      let fullPath = resolve(outputPath);
      if (fullPath.endsWith('.png')) {
        fullPath = fullPath.replace(/\.png$/, '.webp');
      }
      mkdirSync(dirname(fullPath), { recursive: true });
      const webpBuffer = await sharp(resultBuffer).webp({ quality: 80 }).toBuffer();
      writeFileSync(fullPath, webpBuffer);
      const sizeKB = (webpBuffer.length / 1024).toFixed(1);
      console.log(`Saved edited image to ${fullPath} (${sizeKB} KB)`);
      saved = true;
      break;
    }
  }

  if (!saved) {
    console.error('No image data in response');
    const textParts = response.candidates[0].content.parts.map(p => p.text).filter(Boolean);
    if (textParts.length) console.error('Response text:', textParts.join('\n'));
    process.exit(1);
  }
} catch (err) {
  console.error('Error editing image:', err.message);
  process.exit(1);
}
