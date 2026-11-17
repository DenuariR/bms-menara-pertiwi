// Generator data uji 30 hari untuk akun teknisi yang sudah ada.
// Membuat: checklist 3 jenis x 3 sesi per shift, roster bulan yang belum punya jadwal,
// dan cleanup.sql yang hanya menghapus baris buatan skrip ini.
// Pemakaian:
//   node scripts/seed-live-30d.mjs <roster.json> [jumlahHari] [outDir] [tanggalAkhir]
// roster.json berisi array {date,shift_id,user_id} hasil query tabel schedules.
import fs from "node:fs";
import path from "node:path";

const ROSTER_FILE = process.argv[2] || "/data/user/0/com.foxdebug.acode/cache/opencode/tmp/sched-nov.json";
const DAYS = Number(process.argv[3] || 30);
const OUT = process.argv[4] || "/data/user/0/com.foxdebug.acode/cache/opencode/tmp/seed-live";
const END = process.argv[5] || new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);

const SHIFTS = [
  { id: 1, name: "Shift Pagi", start: 7 },
  { id: 2, name: "Shift Sore", start: 15 },
  { id: 3, name: "Shift Malam", start: 23 },
];
const KINDS = ["Chiller York Centrifugal", "Panel Utama Listrik", "Monitoring Ruang Pompa"];
const NOTES = [
  "Tekanan rendah, cek filter",
  "Suhu oli di atas normal",
  "Level air turun, perlu pengisian",
  "Ada bunyi tidak normal, perlu pengecekan",
  "Getaran pompa meningkat",
];

const SRC = fs.readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
const i0 = SRC.indexOf("const labels=");
if (i0 < 0) throw new Error("labels tidak ditemukan di src/index.js");
let j = i0 + 13, depth = 0, end = -1;
for (; j < SRC.length; j++) {
  const ch = SRC[j];
  if (ch === "{") depth++;
  else if (ch === "}") { depth--; if (depth === 0) { end = j + 1; break; } }
}
const labels = eval("(" + SRC.slice(i0 + 13, end) + ")");

function hash(s) { let h = 2166136261; for (let k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619); } return h >>> 0; }
function mkRng(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// [kata kunci nama item, min, max, desimal]
const NUM_RULES = [
  ["LEAVING CHILLER", 6.5, 8.4, 1],
  ["RETURN CHILLER", 11, 13.5, 1],
  ["EVAP PRESS", 300, 500, 0],
  ["COND PRESS", 620, 880, 0],
  ["EVAP TEMP", 4, 9.5, 1],
  ["COND TEMP", 26, 38, 1],
  ["EVAP SAT", 4, 9, 1],
  ["COND SAT", 28, 38, 1],
  ["SMALL TEMP DIFF", 0.4, 2.6, 1],
  ["OIL PRESS (KPA", 100, 220, 0],
  ["OIL PRESS", 3.2, 5.6, 1],
  ["DISCHARGE SUPERHEAT", 6, 18, 1],
  ["DISCHARGE TEMP", 52, 74, 1],
  ["OIL SUMP TEMP", 38, 55, 1],
  ["OIL SETPOINT", 40, 50, 1],
  ["VSD HEATING", 34, 52, 1],
  ["SURGE COUNT", 0, 3, 0],
  ["RUNNING HOUR", 4800, 21000, 0],
  ["NUMBER OF STARTS", 400, 1600, 0],
  ["FULL LOAD AMP", 180, 420, 0],
  ["CURENT LIMIT", 88, 100, 0],
  ["CURRENT LIMIT", 88, 100, 0],
  ["OUTPUT VOLTAGE", 375, 415, 0],
  ["OUTPUT CURRENT", 120, 320, 1],
  ["TEMP °C", 6.4, 7.8, 1],
  ["SETPOINT", 6.4, 7.8, 1],
  ["FREKUENSI", 49.8, 50.2, 2],
  ["HZ", 49.8, 50.2, 2],
  ["VOLT PH", 218, 232, 0],
  ["VOLTAGE", 378, 402, 0],
  ["VOLT", 218, 232, 0],
  ["AMPERE", 8, 58, 1],
  ["ARUS", 8, 58, 1],
  ["PF", 0.85, 0.99, 2],
  ["COS Q", 0.85, 0.99, 2],
  ["COSQ", 0.85, 0.99, 2],
  ["KWH", 1200, 48000, 0],
  ["KVARH", 40, 900, 0],
  ["THD LIMIT", 5, 8, 1],
  ["THD", 1, 4.5, 1],
  ["TEMPERATUR", 24, 38, 1],
  ["TEMP", 24, 38, 1],
  ["PRESSURE", 1.2, 6.4, 1],
  ["PRESS", 1.2, 6.4, 1],
  ["LEVEL", 25, 95, 0],
  ["DAYA", 60, 320, 1],
  ["LOAD", 60, 320, 1],
  ["STAND", 1200, 48000, 1],
  ["SENSITIVITY", 0.5, 0.9, 2],
  ["RECON", 1, 10, 0],
  ["RATED STEPS", 6, 14, 0],
  ["SWITCH PROG", 1, 4, 0],
  ["C/K", 0.4, 0.9, 2],
];
function pickNumber(name, rnd) {
  const u = String(name).toUpperCase();
  for (const [key, min, max, dec] of NUM_RULES) {
    if (u.includes(key)) {
      const v = min + rnd() * (max - min);
      return dec ? v.toFixed(dec) : String(Math.round(v));
    }
  }
  return (1 + rnd() * 99).toFixed(1);
}
function pickChoice(type, rnd) {
  const r = rnd();
  if (type === "HML") return r < 0.85 ? "H" : r < 0.97 ? "M" : "L";
  if (type === "HL") return r < 0.9 ? "H" : "L";
  if (type === "AOM") return r < 0.85 ? "A" : r < 0.95 ? "O" : "M";
  return "Normal";
}
function pickText(name, rnd) {
  const u = String(name).toUpperCase();
  if (u.includes("ON/OFF")) return rnd() < 0.85 ? "ON" : "OFF";
  if (u.includes("CAPACITOR")) return rnd() < 0.8 ? "ON" : "OFF";
  if (u.includes("STATUS")) return rnd() < 0.8 ? "Auto" : "Manual";
  if (u.includes("KUALITAS")) return rnd() < 0.8 ? "Jernih" : "Keruh";
  if (u.includes("CATATAN")) return "Tidak ada temuan";
  return "Normal";
}

function shiftDate(ds, delta) {
  const d = new Date(ds + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
const sql = (v) => "'" + String(v).replace(/'/g, "''") + "'";

const dates = [];
for (let k = DAYS - 1; k >= 0; k--) dates.push(shiftDate(END, -k));
const first = dates[0], last = dates[dates.length - 1];

// Roster: pakai jadwal yang ada, salin pola hari yang sama untuk tanggal yang belum punya jadwal.
const rawRoster = JSON.parse(fs.readFileSync(ROSTER_FILE, "utf8"));
const rosterRows = rawRoster[0] && Array.isArray(rawRoster[0].results) ? rawRoster[0].results : rawRoster;
const have = new Set(rosterRows.map((r) => r.date));
const byWeekday = new Map();
for (const r of rosterRows) {
  const wd = new Date(r.date + "T00:00:00Z").getUTCDay();
  if (!byWeekday.has(wd)) byWeekday.set(wd, []);
  byWeekday.get(wd).push(r);
}
const addedRoster = [];
for (const date of dates) {
  if (have.has(date)) continue;
  const wd = new Date(date + "T00:00:00Z").getUTCDay();
  const all = byWeekday.get(wd) || [];
  if (!all.length) continue;
  const ref = all.map((r) => r.date).sort()[0];
  const pattern = all.filter((r) => r.date === ref);
  const seen = new Set();
  for (const r of pattern) {
    const key = r.shift_id + "|" + r.user_id;
    if (seen.has(key)) continue;
    seen.add(key);
    rosterRows.push({ date, shift_id: r.shift_id, user_id: r.user_id });
    addedRoster.push({ date, shift_id: r.shift_id, user_id: r.user_id });
  }
  have.add(date);
}
const roster = new Map();
for (const r of rosterRows) {
  const key = r.date + "|" + r.shift_id;
  if (!roster.has(key)) roster.set(key, []);
  if (!roster.get(key).includes(r.user_id)) roster.get(key).push(r.user_id);
}
for (const list of roster.values()) list.sort((a, b) => a - b);

function combos() { return KINDS.flatMap((kind) => [1, 2, 3].map((sesi) => ({ kind, sesi }))); }
const ALL = combos();

function profile(date, shiftId) {
  if (date === last) {
    if (shiftId === 1) return "full";
    if (shiftId === 2) return "part";
    return "empty";
  }
  if (date === shiftDate(last, -1)) return "full";
  if (date === shiftDate(last, -2) && shiftId === 3) return "part";
  if (date === shiftDate(last, -4) && shiftId === 3) return "empty";
  if (date === shiftDate(last, -7) && shiftId === 2) return "part";
  if (date === shiftDate(last, -11) && shiftId === 3) return "empty";
  const p = mkRng(hash("profile|" + date + "|" + shiftId))();
  if (p < 0.78) return "full";
  if (p < 0.91) return "part";
  return "empty";
}

function partCombos(date, shiftId) {
  const rnd = mkRng(hash("part|" + date + "|" + shiftId));
  const n = 4 + Math.floor(rnd() * 4);
  const pool = ALL.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const k = Math.floor(rnd() * (i + 1));
    const tmp = pool[i]; pool[i] = pool[k]; pool[k] = tmp;
  }
  return pool.slice(0, n);
}

let createdSeq = 0;
const rows = [];
const meta = [];
const counts = { full: 0, part: 0, empty: 0 };

for (const date of dates) {
  for (const sh of SHIFTS) {
    const techs = roster.get(date + "|" + sh.id) || [];
    if (!techs.length) continue;
    const kind = profile(date, sh.id);
    counts[kind]++;
    const filled = kind === "full" ? ALL : kind === "part" ? partCombos(date, sh.id) : [];
    for (const uid of techs) {
      const rnd = mkRng(hash("vals|" + date + "|" + sh.id + "|" + uid));
      for (const c of filled) {
        const groups = labels[c.kind] || [];
        const vals = {};
        for (const g of groups) {
          for (const [name, type] of g.items) {
            const key = g.group + "::" + name;
            if (type === "angka") vals[key] = pickNumber(name, rnd);
            else if (type === "HML" || type === "HL" || type === "AOM") vals[key] = pickChoice(type, rnd);
            else vals[key] = pickText(name, rnd);
          }
        }
        const needFollow = rnd() < 0.07;
        const hour = (sh.start - 7 + 24) % 24 + [1, 4, 7][c.sesi - 1];
        const minute = (createdSeq * 7) % 60;
        const second = (createdSeq * 13) % 60;
        createdSeq++;
        const createdAt = date + "T" + String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0") + ":" + String(second).padStart(2, "0") + ".000Z";
        rows.push({
          user_id: uid, date, kind: c.kind, values_json: JSON.stringify(vals), created_at: createdAt,
          shift_id: sh.id, status: needFollow ? "Perlu Tindak Lanjut" : "Sudah Diisi",
          follow_up_note: needFollow ? NOTES[(createdSeq + sh.id) % NOTES.length] : "", sesi: c.sesi,
        });
        meta.push({ date, user_id: uid, kind: c.kind, sesi: c.sesi });
      }
    }
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const CHUNK = 150;
let fileNo = 0;
for (let k = 0; k < rows.length; k += CHUNK) {
  fileNo++;
  const body = rows.slice(k, k + CHUNK).map((r) =>
    "INSERT OR IGNORE INTO checklists (user_id,date,kind,values_json,created_at,shift_id,status,follow_up_note,sesi) VALUES (" +
    [r.user_id, sql(r.date), sql(r.kind), sql(r.values_json), sql(r.created_at), r.shift_id, sql(r.status), sql(r.follow_up_note), r.sesi].join(",") + ");"
  ).join("\n");
  fs.writeFileSync(path.join(OUT, "seed_" + String(fileNo).padStart(2, "0") + ".sql"), body + "\n");
}
fs.writeFileSync(path.join(OUT, "seed-meta.json"), JSON.stringify(meta));

if (addedRoster.length) {
  fs.writeFileSync(path.join(OUT, "roster.sql"), addedRoster.map((s) =>
    "INSERT OR IGNORE INTO schedules (user_id,shift_id,date) VALUES (" + s.user_id + "," + s.shift_id + "," + sql(s.date) + ");"
  ).join("\n") + "\n");
}

const cleanup = [
  "-- Menghapus hanya data uji yang dibuat scripts/seed-live-30d.mjs (" + first + " sampai " + last + ").",
  ...meta.map((m) => "DELETE FROM checklists WHERE user_id=" + m.user_id + " AND date=" + sql(m.date) + " AND kind=" + sql(m.kind) + " AND sesi=" + m.sesi + ";"),
  ...addedRoster.map((s) => "DELETE FROM schedules WHERE user_id=" + s.user_id + " AND shift_id=" + s.shift_id + " AND date=" + sql(s.date) + ";"),
];
fs.writeFileSync(path.join(OUT, "cleanup.sql"), cleanup.join("\n") + "\n");

const byUser = new Map();
for (const r of rows) byUser.set(r.user_id, (byUser.get(r.user_id) || 0) + 1);
console.log("rentang:", first, "->", last, "(" + dates.length + " hari)");
console.log("record checklist:", rows.length, "| file:", fileNo, "| folder:", OUT);
console.log("shift lengkap:", counts.full, "| sebagian:", counts.part, "| kosong:", counts.empty);
console.log("roster tambahan:", addedRoster.length, "baris (bulan tanpa jadwal)");
console.log("follow up:", rows.filter((r) => r.status === "Perlu Tindak Lanjut").length, "record");
for (const [uid, n] of [...byUser].sort((a, b) => a[0] - b[0])) console.log("  user", uid, n, "record");
console.log("cleanup:", path.join(OUT, "cleanup.sql"));
