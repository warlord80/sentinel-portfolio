import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  await page.goto("http://localhost:3150", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const checks = {};

  // Test mobile nav overlay
  const hamburger = page.locator("button[aria-label='Open menu']");
  checks["Hamburger visible"] = await hamburger.isVisible();

  await hamburger.click();
  await page.waitForTimeout(400);

  const navOverlay = page.locator("div[aria-hidden='false']");
  checks["Nav overlay opens"] = await navOverlay.count() > 0;

  const navLinks = page.locator("div[aria-hidden='false'] a");
  const linkCount = await navLinks.count();
  checks["Nav links visible (5)"] = linkCount === 5;

  if (linkCount > 0) {
    const firstLink = navLinks.first();
    checks["First link text is About"] = (await firstLink.textContent())?.trim() === "About";
  }

  // Close nav
  const closeBtn = page.locator("button[aria-label='Close menu']");
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // Check footer
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(800);

  const footer = page.locator("footer");
  checks["Footer visible"] = await footer.isVisible();

  const nuozor = page.locator("footer >> text=NUOZOR");
  checks["Footer NUOZOR text visible"] = await nuozor.isVisible();

  // Check hero heading size on mobile
  const h1 = page.locator("h1");
  const h1Box = await h1.boundingBox();
  if (h1Box) {
    checks["Hero heading fits mobile width"] = h1Box.width <= 375;
    checks["Hero heading has readable height"] = h1Box.height > 30;
  }

  // Check contact form inputs
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  checks["Contact name input exists"] = (await page.locator("#contact-name").count()) > 0;
  checks["Contact email input exists"] = (await page.locator("#contact-email").count()) > 0;
  checks["Contact message textarea exists"] = (await page.locator("#contact-message").count()) > 0;
  checks["Send button exists"] = (await page.locator("button:text('Send Message')").count()) > 0;

  console.log("\n=== PHASE 5 MOBILE QA ===");
  let passed = 0;
  for (const [check, ok] of Object.entries(checks)) {
    console.log(`${ok ? "✅" : "❌"} ${check}`);
    if (ok) passed++;
  }
  console.log(`\n✅ ${passed}/${Object.keys(checks).length} passed`);

  await browser.close();
})().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
