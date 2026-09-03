import { chromium } from "@playwright/test";

const errors = [];
const warnings = [];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
    if (msg.type() === "warning") warnings.push(msg.text());
  });

  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("http://localhost:3150", { waitUntil: "networkidle" });

  // Wait for hero entrance animation to complete
  await page.waitForTimeout(2000);

  // Check critical DOM elements
  const checks = {
    "Navigation exists": await page.locator("header nav").count() > 0,
    "Hero heading visible": await page.locator("h1").isVisible(),
    "Hero tag visible": await page.locator("span:text-is('Cybersecurity Analyst')").first().isVisible(),
    "Hero buttons visible": await page.locator("text=Explore Work").isVisible(),
    "About section exists": await page.locator("#about").count() > 0,
    "Skills section exists": await page.locator("#skills").count() > 0,
    "Projects section exists": await page.locator("#projects").count() > 0,
    "Experience section exists": await page.locator("#experience").count() > 0,
    "Certifications section exists": await page.locator("#certifications").count() > 0,
    "Writeups section exists": await page.locator("#writeups").count() > 0,
    "Contact section exists": await page.locator("#contact").count() > 0,
    "Footer exists": await page.locator("footer").count() > 0,
  };

  // Check that Lenis is loaded (html should have lenis class or smooth scroll)
  const htmlClass = await page.locator("html").getAttribute("class");
  checks["Lenis initialized (html class)"] = htmlClass?.includes("lenis") ?? false;

  // Check GSAP animations fired (hero elements should be visible after 2s)
  const heroVisible = await page.locator("h1").isVisible();
  checks["Hero entrance animation fired"] = heroVisible;

  // Check nav links exist
  const navLinkCount = await page.locator("nav ul li a").count();
  checks["Nav links count (5)"] = navLinkCount === 5;

  // Scroll down and check scroll-triggered reveals
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);

  // Check nav background appears after scroll
  const navHasBg = await page.locator("header").evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return styles.backdropFilter !== "none" || el.className.includes("backdrop");
  });
  checks["Nav gets backdrop on scroll"] = navHasBg;

  console.log("\n=== VERIFICATION RESULTS ===");
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`${passed ? "✅" : "❌"} ${check}`);
  }

  if (errors.length > 0) {
    console.log("\n=== CONSOLE ERRORS ===");
    errors.forEach((e) => console.log(`  ❌ ${e}`));
  } else {
    console.log("\n✅ No console errors");
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} console warnings (non-blocking)`);
  }

  const allPassed = Object.values(checks).every(Boolean) && errors.length === 0;
  console.log(`\n${allPassed ? "✅ ALL CHECKS PASSED" : "❌ SOME CHECKS FAILED"}`);

  await browser.close();
  process.exit(allPassed ? 0 : 1);
})().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
