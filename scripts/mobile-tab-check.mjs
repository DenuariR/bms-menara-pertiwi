import { chromium } from "playwright";
const BASE = "https://dcm.denuriramadhan.my.id/";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.fill("#username", process.env.MOB_ADMIN_USER);
await page.fill("#password", process.env.MOB_ADMIN_PASS);
await page.click("#loginBtn");
await page.waitForSelector("#appShell:not(.hidden)", { timeout: 30000 });
await page.evaluate(() => { const b = document.querySelector('#adminHome button[data-admintab-btn="ringkasan"]'); if (b) b.click(); });
await page.waitForTimeout(1500);
const tabs = await page.evaluate(() => {
  const iw = window.innerWidth;
  return [...document.querySelectorAll("#adminTabs button")].map((b) => {
    const r = b.getBoundingClientRect();
    return { tab: b.dataset.admintabBtn, left: Math.round(r.left), right: Math.round(r.right), ok: r.left >= 0 && r.right <= iw + 1 };
  });
});
console.log("TABS", JSON.stringify(tabs));
for (const tab of ["ringkasan", "monitoring", "rekap", "jadwal", "pengaturan", "password"]) {
  await page.evaluate((t) => { const b = document.querySelector('#adminTabs button[data-admintab-btn="' + t + '"]'); if (b) b.click(); }, tab);
  await page.waitForTimeout(900);
  const r = await page.evaluate((t) => {
    const panel = [...document.querySelectorAll("section[data-admintab]")].find((s) => s.dataset.admintab === t && !s.classList.contains("hidden"));
    if (!panel) return { visible: false };
    const h = panel.querySelector("h2");
    const sticky = document.querySelector("#adminTabs");
    const stickyBottom = sticky ? Math.round(sticky.getBoundingClientRect().bottom) : 0;
    const top = h ? Math.round(h.getBoundingClientRect().top) : 0;
    return { visible: true, headingTop: top, stickyBottom, covered: top < stickyBottom, scroll: document.documentElement.scrollWidth };
  }, tab);
  console.log("PANEL", tab, JSON.stringify(r));
}
console.log("ERRORS", errors.length, errors.slice(0, 5).join(" | "));
await browser.close();
