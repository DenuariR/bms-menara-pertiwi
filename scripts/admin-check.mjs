import { chromium } from "playwright";

const BASE = "https://dcm.denuriramadhan.my.id/";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.fill("#username", process.env.ADMIN_CHECK_USER);
await page.fill("#password", process.env.ADMIN_CHECK_PASS);
await page.click("#loginBtn");
await page.waitForSelector("#appShell:not(.hidden)", { timeout: 30000 });
await page.waitForTimeout(2500);
await page.click('#adminHome button[data-admintab-btn="ringkasan"]');
await page.waitForTimeout(1200);

const tabs = ["ringkasan", "monitoring", "rekap", "jadwal", "pengaturan", "password"];
const results = [];
for (const tab of tabs) {
  await page.click(`#adminTabs button[data-admintab-btn="${tab}"]`);
  await page.waitForTimeout(1800);
  const r = await page.evaluate(() => {
    const sw = document.documentElement.scrollWidth;
    const iw = window.innerWidth;
    const clipped = [];
    document.querySelectorAll("#adminArea td, #adminArea th, #adminArea input, #adminArea select, #adminArea button, #adminArea .toolbar, #adminArea .grid").forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
        clipped.push(el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : "") + " " + el.scrollWidth + ">" + el.clientWidth);
      }
    });
    return { sw, iw, clipped: clipped.slice(0, 8), count: clipped.length };
  });
  results.push(`${tab}: scroll=${r.sw}/${r.iw} clipped=${r.count} ${r.clipped.join(" | ")}`);
}
console.log(results.join("\n"));
await browser.close();
