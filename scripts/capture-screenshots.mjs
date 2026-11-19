import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "https://daily-checklist-monitoring.mipzu.workers.dev";
const ADMIN_USER = process.env.SCREENSHOT_ADMIN_USER;
const ADMIN_PASS = process.env.SCREENSHOT_ADMIN_PASS;
const OUT = "screenshots";

if (!ADMIN_USER || !ADMIN_PASS) throw new Error("Admin credentials missing");
fs.mkdirSync(OUT, { recursive: true });

const api = async (path, opts = {}, token = "") => {
  const r = await fetch(BASE + "/api" + path, {
    ...opts,
    headers: { "content-type": "application/json", authorization: "Bearer " + token, ...(opts.headers || {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(path + " -> " + r.status + " " + (j.error || ""));
  return j;
};

const shot = async (page, name, locator) => {
  const visible = locator ? await locator.isVisible().catch(() => false) : false;
  if (visible) {
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({ path: `${OUT}/${name}.png` });
  } else {
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  }
  console.log("saved", name);
};

const browser = await chromium.launch({ headless: true });
let tempUserId = null;
try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await desktop.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot(page, "01-login");

  await page.fill("#username", ADMIN_USER);
  await page.fill("#password", ADMIN_PASS);
  await page.click("#loginBtn");
  await page.waitForSelector("#appShell:not(.hidden)", { timeout: 30000 });
  await page.waitForTimeout(2500);
  await shot(page, "02-admin-dashboard");

  await page.locator("#adminHistoryPanel").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await shot(page, "03-admin-history", page.locator("#adminHistoryPanel"));

  await page.click('button[data-admintab-btn="monitoring"]');
  await page.waitForSelector('section[data-admintab="monitoring"]:not(.hidden)');
  await page.waitForTimeout(1500);
  await shot(page, "04-admin-monitoring", page.locator('section[data-admintab="monitoring"]'));

  await page.click('button[data-admintab-btn="jadwal"]');
  await page.waitForSelector('section[data-admintab="jadwal"]:not(.hidden)');
  await page.waitForTimeout(2000);
  await shot(page, "05-admin-schedule", page.locator('section[data-admintab="jadwal"]'));

  const adminToken = await page.evaluate(() => localStorage.getItem("dcm_token"));
  if (!adminToken) throw new Error("Admin token missing");

  const suffix = Date.now().toString().slice(-6);
  const techUser = "shot" + suffix;
  const techPass = "Shot" + suffix + "!";
  const created = await api("/admin/users", {
    method: "POST",
    body: JSON.stringify({ name: "Teknisi Contoh", username: techUser, password: techPass, role: "user" }),
  }, adminToken);
  console.log("temp user created", created.ok !== false);
  const users = await api("/admin/users", {}, adminToken);
  const found = users.users.find((u) => u.username === techUser);
  if (found) tempUserId = found.id;

  const techLogin = await fetch(BASE + "/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: techUser, password: techPass }),
  });
  const techToken = (await techLogin.json()).token;
  if (!techToken) throw new Error("Technician login failed");

  const kinds = ["Chiller York Centrifugal", "Panel Utama Listrik", "Monitoring Ruang Pompa"];
  const kind = kinds[0];
  const fields = await api("/fields?kind=" + encodeURIComponent(kind), {}, techToken);
  const values = {};
  for (const group of fields.fields || []) {
    for (const item of group.items || []) {
      values[group.group + "::" + item.n] = item.t === "angka" ? "1" : "OK";
    }
  }
  try {
    await api("/checklists", {
      method: "POST",
      body: JSON.stringify({
        date: new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10),
        kind,
        values,
        shift_id: 1,
        sesi: 1,
        status: "Sudah Diisi",
        edit: 1,
      }),
    }, techToken);
    console.log("sample checklist created");
  } catch (e) {
    console.log("sample checklist skipped:", e.message);
  }

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mpage = await mobile.newPage();
  await mpage.goto(BASE, { waitUntil: "networkidle" });
  await mpage.fill("#username", techUser);
  await mpage.fill("#password", techPass);
  await mpage.click("#loginBtn");
  await mpage.waitForSelector("#appShell:not(.hidden)", { timeout: 30000 });
  await mpage.waitForTimeout(2000);
  await mpage.click('#kindNav button[data-kind="Chiller York Centrifugal"]');
  await mpage.waitForSelector("#formPanel:not(.hidden)", { timeout: 10000 });
  await mpage.waitForTimeout(1200);
  await shot(mpage, "06-technician-form", mpage.locator("#formPanel"));

  await mpage.click("#navHist");
  await mpage.waitForSelector("#histPanel:not(.hidden)");
  await mpage.waitForTimeout(1200);
  await shot(mpage, "07-technician-history", mpage.locator("#histPanel"));
} finally {
  await browser.close();
}

if (tempUserId) {
  try {
    const lr = await fetch(BASE + "/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
    });
    const token = (await lr.json()).token;
    await fetch(BASE + "/api/admin/users/" + tempUserId, { method: "DELETE", headers: { authorization: "Bearer " + token } });
    console.log("temp user removed");
  } catch (e) {
    console.log("temp user cleanup failed:", e.message);
  }
}
