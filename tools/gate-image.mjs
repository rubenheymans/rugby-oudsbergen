import sharp from 'sharp';
import { existsSync } from 'fs';

// Objective gate for a generated image. Deterministic checks only — NO aesthetic
// judgment (that's the human's call on the shortlist). Exit 0 = pass, 1 = fail/error.
// Prints a JSON verdict to stdout: { path, pass, checks: [{name, pass, detail}] }.

const args = process.argv.slice(2);
const flag = (name, def = null) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : def; };
const has = (name) => args.includes(name);

const path = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!path) {
  console.error(`Usage: node tools/gate-image.mjs <image> [--aspect 16:9] [--expect-alpha] \\
  [--palette '#RRGGBB,#RRGGBB'] [--palette-min 0.03] [--color-tol 40] [--min-variance 8]

Objective pass/fail gate (no aesthetic judgment). Use it to auto-reject broken
candidates before a human picks the winner from the survivors.`);
  process.exit(1);
}

const aspect = flag('--aspect');               // e.g. "16:9"
const expectAlpha = has('--expect-alpha');
const palette = (flag('--palette') || '').split(',').map(s => s.trim()).filter(Boolean);
const paletteMin = parseFloat(flag('--palette-min', '0.03'));  // min fraction of pixels near a target
const colorTol = parseInt(flag('--color-tol', '40'), 10);      // per-channel match tolerance
const minVariance = parseFloat(flag('--min-variance', '8'));   // below = blank/flat

const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass, detail });
const hexToRGB = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

try {
  if (!existsSync(path)) { add('exists', false, 'file not found'); throw new Error('missing'); }

  const meta = await sharp(path).metadata();
  add('decodes', !!meta.width, `${meta.width}x${meta.height} ${meta.format}`);

  // aspect ratio (3% tolerance)
  if (aspect) {
    const [aw, ah] = aspect.split(':').map(Number);
    const want = aw / ah, got = meta.width / meta.height;
    const ok = Math.abs(want - got) / want < 0.03;
    add('aspect', ok, `want ${aspect} (${want.toFixed(3)}), got ${got.toFixed(3)}`);
  }

  // one downscaled raw read drives variance / transparency / palette
  const W = 128;
  const { data, info } = await sharp(path)
    .resize(W, W, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;

  // blank/flat detection: per-channel stddev of RGB
  let n = 0; const sum = [0, 0, 0], sum2 = [0, 0, 0];
  let transparent = 0;
  const palCounts = palette.map(() => 0);
  const targets = palette.map(hexToRGB);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 16) { transparent++; continue; }   // skip transparent pixels for color stats
    n++;
    sum[0] += r; sum[1] += g; sum[2] += b;
    sum2[0] += r * r; sum2[1] += g * g; sum2[2] += b * b;
    for (let t = 0; t < targets.length; t++) {
      const [tr, tg, tb] = targets[t];
      if (Math.abs(r - tr) < colorTol && Math.abs(g - tg) < colorTol && Math.abs(b - tb) < colorTol) palCounts[t]++;
    }
  }
  // blank check is for photos/full-bleed images; skip for marks (--expect-alpha),
  // which are legitimately flat. transparency + palette gate those instead.
  if (!expectAlpha) {
    const std = [0, 1, 2].map(c => Math.sqrt(Math.max(0, sum2[c] / n - (sum[c] / n) ** 2)));
    const meanStd = std.reduce((x, y) => x + y, 0) / 3;
    add('not-blank', meanStd >= minVariance, `mean RGB stddev ${meanStd.toFixed(1)} (min ${minVariance})`);
  }

  if (expectAlpha) {
    const frac = transparent / px;
    add('transparency', meta.hasAlpha && frac >= 0.02, `${(frac * 100).toFixed(1)}% transparent`);
  }

  if (palette.length) {
    const fracs = palCounts.map(c => c / Math.max(1, n));
    const best = Math.max(...fracs);
    add('palette', best >= paletteMin,
      palette.map((h, i) => `${h}:${(fracs[i] * 100).toFixed(1)}%`).join(' ') + ` (min ${(paletteMin * 100).toFixed(1)}%)`);
  }
} catch (e) {
  if (!checks.length) add('error', false, e.message);
}

const pass = checks.every(c => c.pass);
console.log(JSON.stringify({ path, pass, checks }, null, 2));
process.exit(pass ? 0 : 1);
