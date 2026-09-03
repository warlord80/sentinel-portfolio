import { chromium } from "@playwright/test";

const width = parseInt(process.argv[2] || "1440");
const height = parseInt(process.argv[3] || "900");
const out = "C:/Users/Jordan/AppData/Local/Temp/opencode/qa-viewport.png";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3150", { waitUntil: "networkidle" });

  // Wait for hero entrance animation
  await page.waitForTimeout(1500);

  // Scroll through the entire page to trigger all ScrollTrigger reveals
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = height * 0.7;
  for (let y = 0; y < totalHeight; y += step) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(400);
  }

  // Scroll back to top for the screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  await page.screenshot({ path: out, fullPage: true });
  console.log(`CAPTURED ${width}x${height} -> ${out}`);
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
