import { chromium } from "@playwright/test";

const errors = [];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("http://localhost:3150", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000); // Wait for Three.js init + hero animation

  const checks = {};

  // === LAYER 1: Core layout & 2D/3D separation ===
  checks["HTML lang attribute"] = (await page.locator("html").getAttribute("lang")) === "en";
  checks["Body has bg-background class"] = (await page.locator("body").getAttribute("class"))?.includes("bg-background") ?? false;

  // === LAYER 2: WebGL canvas exists at z-[-1] with pointer-events none ===
  const canvas = page.locator("canvas");
  checks["WebGL canvas exists"] = (await canvas.count()) > 0;
  if (await canvas.count() > 0) {
    const canvasStyle = await canvas.first().evaluate((el) => {
      const parent = el.closest("[data-environment-layer]");
      if (!parent) return { z: "", pe: "" };
      const ps = window.getComputedStyle(parent);
      return { z: ps.zIndex, pe: ps.pointerEvents };
    });
    checks["Environment layer z-index is -1"] = canvasStyle.z === "-1";
    checks["Environment layer pointer-events none"] = canvasStyle.pe === "none";
  }

  // === LAYER 3: All sections present ===
  const sections = ["about", "skills", "projects", "experience", "certifications", "writeups", "contact"];
  for (const id of sections) {
    checks[`Section #${id} exists`] = (await page.locator(`#${id}`).count()) > 0;
  }

  // === LAYER 4: Navigation ===
  checks["Nav exists"] = (await page.locator("header nav").count()) > 0;
  checks["Nav links (5)"] = (await page.locator("nav ul li a").count()) === 5;

  // === LAYER 5: Hero ===
  checks["Hero heading visible"] = await page.locator("h1").isVisible();
  checks["Hero tag visible"] = await page.locator("span:text-is('Cybersecurity Analyst')").first().isVisible();
  checks["Hero buttons"] = (await page.locator("text=Explore Work").count()) > 0;
  checks["Hero spacer (sentinel slot)"] = (await page.locator("[aria-hidden='true'] .h-\\[420px\\]").count()) > 0;

  // === LAYER 6: Three.js sentinel group ===
  // Check if the sentinel group exists in the canvas scene
  const sentinelExists = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return false;
    // R3F stores scene data on the canvas fiber root
    const fiberRoot = canvas.__r$;
    return !!fiberRoot;
  });
  checks["Three.js fiber root attached to canvas"] = sentinelExists;

  // === LAYER 7: Lenis smooth scroll ===
  checks["Lenis class on html"] = (await page.locator("html").getAttribute("class"))?.includes("lenis") ?? false;

  // === LAYER 8: Scroll behavior ===
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(800);
  const navScrolled = await page.locator("header").evaluate((el) => {
    return el.className.includes("backdrop") || window.getComputedStyle(el).backdropFilter !== "none";
  });
  checks["Nav backdrop after scroll"] = navScrolled;

  // === LAYER 9: Footer ===
  checks["Footer exists"] = (await page.locator("footer").count()) > 0;
  checks["Footer NUOZOR text"] = (await page.locator("text=NUOZOR").count()) > 0;

  // === LAYER 10: Responsive (mobile) ===
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  checks["Mobile: nav links hidden"] = !(await page.locator("nav ul").isVisible());
  checks["Mobile: hamburger visible"] = await page.locator("button[aria-label='Open menu']").isVisible();
  checks["Mobile: hero heading visible"] = await page.locator("h1").isVisible();

  // Screenshot at mobile
  await page.screenshot({ path: "C:/Users/Jordan/AppData/Local/Temp/opencode/qa-phase4-mobile.png", fullPage: false });

  // Back to desktop for full screenshot
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/Jordan/AppData/Local/Temp/opencode/qa-phase4-desktop.png", fullPage: true });

  // === RESULTS ===
  console.log("\n=== PHASE 4 VERIFICATION RESULTS ===");
  let passed = 0;
  let failed = 0;
  for (const [check, ok] of Object.entries(checks)) {
    const icon = ok ? "✅" : "❌";
    console.log(`${icon} ${check}`);
    if (ok) passed++; else failed++;
  }

  if (errors.length > 0) {
    console.log("\n=== CONSOLE ERRORS ===");
    errors.forEach((e) => console.log(`  ❌ ${e}`));
  } else {
    console.log("\n✅ No console errors");
  }

  console.log(`\n✅ ${passed} passed, ❌ ${failed} failed`);
  console.log(failed === 0 && errors.length === 0 ? "\n✅ ALL CHECKS PASSED" : "\n❌ SOME CHECKS FAILED");

  await browser.close();
  process.exit(failed === 0 && errors.length === 0 ? 0 : 1);
})().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
