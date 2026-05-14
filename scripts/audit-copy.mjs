import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checkedExtensions = new Set([".html", ".css", ".js", ".md", ".json"]);
const ignoredDirs = new Set([".git", "node_modules"]);
const banned = [
  { label: "em dash", pattern: /—/g },
  { label: "generic phrase: elevate your space", pattern: /elevate your space/gi },
  { label: "generic phrase: unlock", pattern: /\bunlock\b/gi },
  { label: "generic phrase: premium solutions", pattern: /premium solutions/gi },
  { label: "generic phrase: transform your space", pattern: /transform your space/gi },
  { label: "generic phrase: journey", pattern: /\bjourney\b/gi },
  { label: "generic phrase: bespoke", pattern: /\bbespoke\b/gi }
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (checkedExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

const findings = [];
for (const file of await walk(root)) {
  const text = await readFile(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of banned) {
      if (rule.pattern.test(line)) {
        findings.push(`${path.relative(root, file)}:${index + 1} ${rule.label}`);
      }
      rule.pattern.lastIndex = 0;
    }
  });
}

if (findings.length) {
  console.error("Copy audit failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Copy audit passed.");
