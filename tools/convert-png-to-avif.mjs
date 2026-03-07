import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const ASSETS_DIR = path.join(ROOT, "public", "assets");

const args = new Set(process.argv.slice(2));
const FORCE = args.has("--force");
const QUALITY = Number.parseInt(getArgValue("--quality"), 10) || 50;

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

async function listImageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await listImageFiles(fullPath)));
      continue;
    }

    if (entry.isFile()) {
      const lower = entry.name.toLowerCase();
      if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function replaceExtToAvif(filePath) {
  return filePath.replace(/\.(png|jpg|jpeg)$/i, ".avif");
}

async function convertOne(filePath) {
  const outPath = replaceExtToAvif(filePath);
  if (!FORCE) {
    try {
      await fs.access(outPath);
      return { status: "skipped", filePath, outPath };
    } catch {
      // continue
    }
  }

  await sharp(filePath)
    .avif({ quality: QUALITY })
    .toFile(outPath);

  return { status: "converted", filePath, outPath };
}

async function run() {
  try {
    await fs.access(ASSETS_DIR);
  } catch {
    console.error(`Assets folder not found: ${ASSETS_DIR}`);
    process.exit(1);
  }

  const files = await listImageFiles(ASSETS_DIR);
  if (files.length === 0) {
    console.log("No PNG/JPG/JPEG files found.");
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const file of files) {
    const res = await convertOne(file);
    if (res.status === "converted") converted += 1;
    if (res.status === "skipped") skipped += 1;
  }

  console.log(`Done. Converted: ${converted}, Skipped: ${skipped}, Total files: ${files.length}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
