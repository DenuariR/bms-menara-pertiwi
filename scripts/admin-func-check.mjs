import { chromium } from "playwright";

const BASE = "https://dcm.denuriramadhan.my.id/";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
const badRequests = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
page.on("response", (r) => { if (r.status() >= 400) badRequests.push(r.status() + " " + r.url()); });

const log = (s) => console.log(s);
await page.goto(BASE, { waitUntil: "networkidle" });
await page.fill("#username", process.env.FUNC_ADMIN_USER);
await page.fill("#password", process.env.FUNC_ADMIN_PASS);
await page.click("#loginBtn");
await page.waitForSelector("#appShell:not(.hidden)", { timeout: 30000 });
await page.waitForTimeout(2500);
log("login ok, token=" + (await page.evaluate(() => !!localStorage.getItem("dcm_token"))));

const check = async (name, fn) => {
  try { log(name + ": " + (await fn())); } catch (e) { log(name + ": FAIL " + e.message); }
};

await check("tab ringkasan", async () => {
  const visible = await page.locator('#adminArea > section[data-admintab="ringkasan"]:not(.hidden)').count();
  const cells = await page.locator("#techMatrix tr").count();
  const charts = await page.locator("#adminArea canvas").count();
  return "panel=" + visible + " rows=" + cells + " charts=" + charts;
});
await check("grafik berubah", async () => {
  await page.click("#r30");
  await page.waitForTimeout(1200);
  return "r30 active=" + await page.locator("#r30").getAttribute("aria-pressed");
});
await check("kpi klik", async () => {
  await page.click('button[kpiClick="follow"]').catch(() => {});
  await page.locator('[onclick="kpiClick(\'follow\')"]').click();
  await page.waitForTimeout(800);
  return "panel monitoring=" + await page.locator('section[data-admintab="monitoring"]:not(.hidden)').count() + " filter=" + (await page.locator("#monitorKind").inputValue());
});

for (const tab of ["monitoring", "rekap", "jadwal", "pengaturan", "password"]) {
  await check("tab " + tab, async () => {
    await page.evaluate((t) => { const b = document.querySelector('#adminHome button[data-admintab-btn="' + t + '"]'); if (b) b.click(); }, tab);
    await page.waitForTimeout(1200);
    const visible = await page.locator('#adminArea > section[data-admintab="' + tab + '"]:not(.hidden)').count();
    return "visible=" + visible;
  });
}
await check("monitoring refresh", async () => {
  await page.evaluate(() => { const b = document.querySelector('#adminHome button[data-admintab-btn="monitoring"]'); if (b) b.click(); });
  await page.waitForTimeout(800);
  await page.click("#refresh");
  await page.waitForTimeout(2000);
  return "rows=" + await page.locator("#reports tr").count() + " stamp=" + (await page.locator("#dashStamp").textContent());
});
await check("rekap refresh", async () => {
  await page.evaluate(() => { const b = document.querySelector('#adminHome button[data-admintab-btn="rekap"]'); if (b) b.click(); });
  await page.waitForTimeout(800);
  await page.click("#monthRefresh");
  await page.waitForTimeout(2000);
  return "rows=" + await page.locator("#monthlyRows tr").count();
});
await check("notifikasi cek", async () => {
  await page.evaluate(() => { const b = document.querySelector('#adminHome button[data-admintab-btn="ringkasan"]'); if (b) b.click(); });
  await page.waitForTimeout(800);
  await page.click("#notifRefresh");
  await page.waitForTimeout(1500);
  return "rows=" + await page.locator("#notifRows tr").count() + " msg=" + (await page.locator("#notifMsg").textContent());
});
await check("riwayat admin", async () => {
  await page.click("#histRefresh");
  await page.waitForTimeout(1500);
  return "html=" + (await page.locator("#histSummary").innerText()).slice(0, 60);
});
await check("jadwal grid", async () => {
  await page.evaluate(() => { const b = document.querySelector('#adminHome button[data-admintab-btn="jadwal"]'); if (b) b.click(); });
  await page.waitForTimeout(2000);
  return "cells=" + await page.locator("#schedMonthBody [data-sched-cell]").count();
});
log("console errors: " + errors.length + " " + errors.slice(0, 6).join(" | "));
log("bad requests: " + badRequests.length + " " + badRequests.slice(0, 6).join(" | "));
await browser.close();
