import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "https://dcm.denuriramadhan.my.id/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
const violations = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
await page.addInitScript(() => {
  document.addEventListener("securitypolicyviolation", (e) => {
    window.__csp = window.__csp || [];
    window.__csp.push(e.violatedDirective + ": " + e.blockedURI);
  });
});
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const chart = await page.evaluate(() => !!window.Chart);
const csp = await page.evaluate(() => window.__csp || []);
console.log("chart loaded:", chart);
console.log("CSP violations:", csp.length, csp.slice(0, 5).join(" | "));
console.log("console errors:", errors.length, errors.slice(0, 5).join(" | "));
await browser.close();
if (!chart || csp.length || errors.length) process.exit(1);
