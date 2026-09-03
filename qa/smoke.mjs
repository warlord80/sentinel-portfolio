import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.goto("http://localhost:3150", { waitUntil: "networkidle" });
  const title = await page.title();
  const bodyBg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  await page.screenshot({
    path: "C:/Users/Jordan/AppData/Local/Temp/opencode/qa-smoke.png",
    fullPage: false,
  });
  console.log("TITLE:", title);
  console.log("BODY_BG:", bodyBg);
  console.log("SCREENSHOT_OK");
  await browser.close();
})().catch((e) => {
  console.error("SMOKE_FAIL:", e.message);
  process.exit(1);
});
