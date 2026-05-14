import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const root = process.cwd();
const outDir = path.join(root, "assets");

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ];
}

function add(a, value) {
  return [a[0] + value, a[1] + value, a[2] + value];
}

function hash2(x, y, seed = 0) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function edgeLine(value, target, width) {
  const distance = Math.abs(value - target);
  return distance < width ? 1 - distance / width : 0;
}

function flake(x, y, cell, density, palette, seed) {
  const cx = Math.floor(x / cell);
  const cy = Math.floor(y / cell);
  const h = hash2(cx, cy, seed);
  if (h > density) return null;

  const px = (cx + hash2(cx, cy, seed + 1)) * cell;
  const py = (cy + hash2(cx, cy, seed + 2)) * cell;
  const radius = 0.85 + hash2(cx, cy, seed + 3) * cell * 0.38;
  const dx = x - px;
  const dy = y - py;
  if (dx * dx + dy * dy > radius * radius) return null;

  return palette[Math.floor(hash2(cx, cy, seed + 4) * palette.length)];
}

function finishTexture(x, y, w, h, paletteName = "charcoal") {
  const nx = x / w;
  const ny = y / h;
  const palettes = {
    charcoal: {
      baseA: [37, 42, 44],
      baseB: [18, 21, 22],
      flakes: [[230, 235, 232], [150, 158, 158], [68, 77, 79], [188, 124, 61], [42, 134, 155]]
    },
    pearl: {
      baseA: [188, 191, 186],
      baseB: [103, 109, 108],
      flakes: [[246, 247, 241], [55, 61, 63], [146, 151, 146], [190, 126, 62], [45, 130, 150]]
    },
    commercial: {
      baseA: [71, 79, 78],
      baseB: [33, 39, 40],
      flakes: [[202, 205, 198], [90, 102, 100], [37, 42, 44], [216, 170, 88], [36, 125, 147]]
    }
  };
  const scheme = palettes[paletteName];
  let color = mix(scheme.baseA, scheme.baseB, ny * 0.8 + nx * 0.15);
  color = add(color, (hash2(Math.floor(x / 3), Math.floor(y / 3), 8) - 0.5) * 18);

  const layerA = flake(x, y, 12, 0.58, scheme.flakes, 20);
  const layerB = flake(x, y, 7, 0.24, scheme.flakes, 40);
  if (layerA) color = mix(color, layerA, 0.8);
  if (layerB) color = mix(color, layerB, 0.9);

  return color;
}

function concreteTexture(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;
  let color = mix([158, 157, 149], [96, 98, 95], ny * 0.7 + nx * 0.15);
  color = add(color, (hash2(Math.floor(x / 5), Math.floor(y / 5), 90) - 0.5) * 24);
  color = add(color, Math.sin((nx + ny) * 32) * 4);

  const crackA = edgeLine(ny + Math.sin(nx * 8) * 0.025, 0.52, 0.003);
  const crackB = edgeLine(nx + Math.sin(ny * 14) * 0.025, 0.64, 0.002);
  const stain = Math.max(0, 1 - Math.hypot(nx - 0.28, ny - 0.64) / 0.18);
  color = add(color, -42 * Math.max(crackA, crackB));
  color = mix(color, [70, 72, 68], stain * 0.32);

  return color;
}

function heroPixel(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;
  const horizon = 0.38;
  let color;

  if (ny < horizon) {
    const wallLight = 1 - ny / horizon;
    color = mix([80, 86, 84], [39, 43, 44], 1 - wallLight * 0.55);
    color = add(color, (hash2(Math.floor(x / 9), Math.floor(y / 9), 5) - 0.5) * 12);

    if (nx > 0.58 && nx < 0.94 && ny > 0.09 && ny < 0.32) {
      const doorLine = edgeLine((nx - 0.58) % 0.055, 0, 0.0016) + edgeLine((ny - 0.09) % 0.055, 0, 0.0018);
      color = mix(color, [103, 110, 108], 0.38);
      color = add(color, doorLine * 26);
    }

    if (nx > 0.08 && nx < 0.35 && ny > 0.16 && ny < 0.22) color = mix(color, [29, 31, 31], 0.65);
    if (nx > 0.1 && nx < 0.34 && ny > 0.22 && ny < 0.27) color = mix(color, [166, 105, 48], 0.42);
  } else {
    const floorY = (ny - horizon) / (1 - horizon);
    color = finishTexture(x, (floorY * h) | 0, w, h, "charcoal");
    const depth = Math.pow(floorY, 0.65);
    color = mix(color, [19, 23, 24], depth * 0.25);

    const shineA = Math.max(0, 1 - Math.abs(nx - (0.22 + floorY * 0.18)) / (0.032 + floorY * 0.03));
    const shineB = Math.max(0, 1 - Math.abs(nx - (0.72 - floorY * 0.22)) / (0.04 + floorY * 0.03));
    color = add(color, (shineA * 28 + shineB * 22) * (1 - floorY * 0.35));

    const joint = edgeLine(nx + Math.sin(floorY * 4) * 0.015, 0.5, 0.0014 + floorY * 0.002);
    color = add(color, -30 * joint);
  }

  const vignette = Math.hypot(nx - 0.5, ny - 0.56);
  color = add(color, -80 * Math.max(0, vignette - 0.52));
  return color;
}

function servicePixel(kind) {
  return (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;

    if (kind === "garage") {
      const horizon = 0.35;
      if (ny < horizon) {
        let wall = mix([195, 197, 190], [113, 119, 116], ny / horizon);
        if (nx > 0.67 && ny > 0.08 && ny < 0.27) wall = mix(wall, [82, 91, 90], 0.45);
        return wall;
      }
      return finishTexture(x, ((ny - horizon) * h) | 0, w, h, "pearl");
    }

    if (kind === "commercial") {
      const horizon = 0.42;
      if (ny < horizon) {
        let wall = mix([67, 76, 77], [29, 35, 37], ny / horizon);
        if (nx > 0.1 && nx < 0.9 && edgeLine(ny, 0.2, 0.01)) wall = add(wall, 30);
        return wall;
      }
      let floor = finishTexture(x, ((ny - horizon) * h) | 0, w, h, "commercial");
      const guide = edgeLine(nx + Math.sin(ny * 4) * 0.01, 0.22, 0.006);
      floor = mix(floor, [221, 158, 67], guide * 0.75);
      return floor;
    }

    if (kind === "patio") {
      const horizon = 0.3;
      if (ny < horizon) {
        let sky = mix([177, 211, 218], [232, 238, 232], ny / horizon);
        if (ny > 0.24) sky = mix(sky, [87, 111, 98], 0.55);
        return sky;
      }
      let floor = finishTexture(x, ((ny - horizon) * h) | 0, w, h, "pearl");
      floor = mix(floor, [126, 134, 128], 0.2);
      const board = edgeLine(nx + Math.sin(ny * 8) * 0.012, 0.15, 0.003);
      return add(floor, -34 * board);
    }

    return finishTexture(x, y, w, h, "charcoal");
  };
}

function beforeAfterPixel(kind) {
  return (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;
    const horizon = 0.34;

    if (ny < horizon) {
      let wall = mix([171, 173, 168], [104, 110, 108], ny / horizon);
      if (nx > 0.72 && ny > 0.1 && ny < 0.27) wall = mix(wall, [66, 74, 75], 0.35);
      return wall;
    }

    if (kind === "before") {
      return concreteTexture(x, ((ny - horizon) * h) | 0, w, h);
    }

    let floor = finishTexture(x, ((ny - horizon) * h) | 0, w, h, "charcoal");
    const reflection = Math.max(0, 1 - Math.abs(nx - (0.62 - ny * 0.14)) / 0.05);
    floor = add(floor, reflection * 24);
    return floor;
  };
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

async function writePng(filename, width, height, pixel) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y += 1) {
    raw[offset++] = 0;
    for (let x = 0; x < width; x += 1) {
      const color = pixel(x, y, width, height);
      raw[offset++] = clamp(Math.round(color[0]));
      raw[offset++] = clamp(Math.round(color[1]));
      raw[offset++] = clamp(Math.round(color[2]));
      raw[offset++] = 255;
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);

  await writeFile(path.join(outDir, filename), png);
}

await mkdir(outDir, { recursive: true });

await writePng("hero-garage.png", 2000, 1200, heroPixel);
await writePng("finish-flake.png", 1400, 1000, servicePixel("flake"));
await writePng("garage-floor.png", 1400, 1000, servicePixel("garage"));
await writePng("shop-floor.png", 1400, 1000, servicePixel("commercial"));
await writePng("patio-coating.png", 1400, 1000, servicePixel("patio"));
await writePng("prep-before.png", 1400, 900, beforeAfterPixel("before"));
await writePng("prep-after.png", 1400, 900, beforeAfterPixel("after"));

console.log("Generated project image assets.");
