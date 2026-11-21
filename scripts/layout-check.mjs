import { chromium } from "playwright";

const BASE = "https://dcm.denuriramadhan.my.id/";
const browser = await chromium.launch({ headless: true });
for (const width of [360, 390, 430]) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.fill("#username", process.env.LAYOUT_ADMIN_USER);
  await page.fill("#password", process.env.LAYOUT_ADMIN_PASS);
  await page.click("#loginBtn");
  await page.waitForSelector("#appShell:not(.hidden)", { timeout: 30000 });
  await page.click('button[data-admintab-btn="password"]');
  await page.waitForSelector("#passPanel:not(.hidden)");
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    const iw = window.innerWidth;
    const sw = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    const vv = window.visualViewport ? Math.round(window.visualViewport.width) : 0;
    const meta = document.querySelector('meta[name="viewport"]');
    const over = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.left < 0 + 1 && r.right > 360) {
        over.push(el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : "") + " L=" + Math.round(r.left) + " R=" + Math.round(r.right) + " W=" + Math.round(r.width) + " minW=" + getComputedStyle(el).minWidth);
      }
    });
    return { iw, sw, cw, vv, meta: meta && meta.content, over: over.slice(0, 20) };
  });
  console.log("WIDTH", width, "inner", info.iw, "client", info.cw, "scroll", info.sw, "visual", info.vv, "meta", info.meta);
  console.log("OVER", info.over.join(" | ") || "none");
  await ctx.close();
}
await browser.close();
