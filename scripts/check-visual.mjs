import { chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.VISUAL_BASE_URL || "http://127.0.0.1:4174";
const candidate = process.env.VISUAL_CANDIDATE_URL || "http://127.0.0.1:4173";
const maxDiffRatio = Number(process.env.VISUAL_DIFF_THRESHOLD || "0.035");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const browser = await chromium.launch({ headless: true });
let failed = false;
await mkdir("test-results/visual", { recursive: true });
try {
  for (const viewport of viewports) {
    const images = [];
    for (const origin of [base, candidate]) {
      const page = await browser.newPage({ viewport, reducedMotion: "reduce", deviceScaleFactor: 1 });
      await page.goto(origin + "/", { waitUntil: "networkidle" });
      await page.evaluate(() => {
        document.querySelectorAll("*").forEach(element => {
          element.style.setProperty("animation", "none", "important");
          element.style.setProperty("transition", "none", "important");
        });
      });
      await page.evaluate(() => document.fonts.ready);
      images.push(PNG.sync.read(await page.screenshot({ animations: "disabled" })));
      await page.close();
    }
    const [before, after] = images;
    if (before.width !== after.width || before.height !== after.height) throw new Error("Image sizes differ");
    const diff = new PNG({ width: before.width, height: before.height });
    const pixels = pixelmatch(before.data, after.data, diff.data, before.width, before.height, { threshold: 0.15 });
    const ratio = pixels / (before.width * before.height);
    await writeFile(`test-results/visual/${viewport.name}-before.png`, PNG.sync.write(before));
    await writeFile(`test-results/visual/${viewport.name}-after.png`, PNG.sync.write(after));
    await writeFile(`test-results/visual/${viewport.name}-diff.png`, PNG.sync.write(diff));
    console.log(`${viewport.name}: pixel diff ${(ratio * 100).toFixed(2)}%`);
    if (ratio > maxDiffRatio) failed = true;
  }
} finally {
  await browser.close();
}
if (failed) {
  console.error("Unexpected visual differences; inspect uploaded screenshots.");
  process.exitCode = 1;
}
