import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "https://dcm.denuriramadhan.my.id/";
const ADMIN_USER = process.env.TUTORIAL_ADMIN_USER;
const ADMIN_PASS = process.env.TUTORIAL_ADMIN_PASS;
const OUT = "tutorial";
if (!ADMIN_USER || !ADMIN_PASS) throw new Error("Admin credentials missing");
fs.mkdirSync(OUT, { recursive: true });

const api = async (path, opts = {}, token = "") => {
  const r = await fetch(BASE.replace(/\/$/, "") + "/api" + path, {
    ...opts,
    headers: { "content-type": "application/json", authorization: "Bearer " + token, ...(opts.headers || {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(path + " -> " + r.status + " " + (j.error || ""));
  return j;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ headless: true });
let tempUserId = null;
let desktop, mobile;
try {
  desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.fill("#username", ADMIN_USER);
  await page.fill("#password", ADMIN_PASS);
  await page.click("#loginBtn");
  await page.waitForSelector("#appShell:not(.hidden)", { timeout: 30000 });
  await page.waitForTimeout(2000);

  await page.fill("#monitorDate", "2026-11-16");
  await page.dispatchEvent("#monitorDate", "change");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${OUT}/admin-dashboard-with-data.png` });
  console.log("saved admin-dashboard-with-data");

  const adminToken = await page.evaluate(() => localStorage.getItem("dcm_token"));
  const suffix = Date.now().toString().slice(-6);
  const techUser = "tut" + suffix;
  const techPass = "Tut" + suffix + "!";
  await api("/admin/users", {
    method: "POST",
    body: JSON.stringify({ name: "Teknisi Tutorial", username: techUser, password: techPass, role: "user" }),
  }, adminToken);
  const users = await api("/admin/users", {}, adminToken);
  const found = users.users.find((u) => u.username === techUser);
  if (!found) throw new Error("Temp user not found");
  tempUserId = found.id;

  const today = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
  await api("/admin/schedule/day", {
    method: "POST",
    body: JSON.stringify({ date: today, users: [{ user_id: tempUserId, shift_ids: [1], off: false }] }),
  }, adminToken);
  console.log("temp user and schedule created");

  mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: OUT, size: { width: 390, height: 844 } },
  });
  const mpage = await mobile.newPage();
  await mpage.goto(BASE, { waitUntil: "networkidle" });
  await sleep(1000);
  await mpage.fill("#username", techUser);
  await mpage.fill("#password", techPass);
  await mpage.click("#loginBtn");
  await mpage.waitForSelector("#appShell:not(.hidden)", { timeout: 30000 });
  await sleep(5500);

  await mpage.click('#kindNav button[data-kind="Chiller York Centrifugal"]');
  await mpage.waitForSelector("#formPanel:not(.hidden)", { timeout: 10000 });
  await sleep(1200);

  const fields = await mpage.locator("#checkFields [data-item]").all();
  for (const field of fields) {
    const type = await field.getAttribute("data-type");
    if (field.tagName === "SELECT") {
      const opts = await field.locator("option").all();
      if (opts.length > 1) await field.selectOption({ index: 1 });
    } else {
      await field.fill(type === "angka" ? "1" : "OK");
    }
    await sleep(35);
  }
  await mpage.fill("#followNote", "Contoh pengisian untuk tutorial");
  await sleep(800);
  await mpage.click("#save");
  await mpage.waitForFunction(() => {
    const el = document.getElementById("saveMsg");
    return el && /tersimpan/i.test(el.textContent || "");
  }, { timeout: 30000 });
  await sleep(1500);
  await mpage.click("#navHist");
  await mpage.waitForSelector("#histPanel:not(.hidden)");
  await sleep(1500);
  console.log("video steps completed");
} finally {
  if (mobile) await mobile.close();
  if (desktop) await desktop.close();
  await browser.close();
}

if (tempUserId) {
  try {
    const lr = await fetch(BASE + "api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
    });
    const token = (await lr.json()).token;
    await fetch(BASE + "api/admin/users/" + tempUserId, { method: "DELETE", headers: { authorization: "Bearer " + token } });
    console.log("temp user removed");
  } catch (e) {
    console.log("cleanup failed:", e.message);
  }
}

const videos = fs.readdirSync(OUT).filter((f) => f.endsWith(".webm"));
if (videos.length) {
  const src = OUT + "/" + videos[0];
  const dest = OUT + "/checklist-tutorial.webm";
  fs.renameSync(src, dest);
  console.log("saved checklist-tutorial.webm", fs.statSync(dest).size);
}
