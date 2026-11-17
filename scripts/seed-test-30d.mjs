// Generator data uji 30 hari untuk user uji1 sampai uji4.
// Membuat: checklist 3 jenis x 3 sesi per hari, roster (schedules), dan cleanup.sql.
// Pemakaian:
//   node scripts/seed-test-30d.mjs [jumlahHari] [outDir] [ids.json]
// ids.json berisi {"uji1":43,"uji2":44,"uji3":45,"uji4":46}.
import fs from "node:fs";
import path from "node:path";

const DAYS = Number(process.argv[2] || 30);
const OUT = process.argv[3] || "/data/user/0/com.foxdebug.acode/cache/opencode/tmp/seed";
const IDS_FILE = process.argv[4] || "/tmp/dcm-seed/ids.json";
const IDS = JSON.parse(fs.readFileSync(IDS_FILE, "utf8"));
const TECHS = [
  { id: IDS.uji1, name: "Teknisi Uji 1", username: "uji1" },
  { id: IDS.uji2, name: "Teknisi Uji 2", username: "uji2" },
  { id: IDS.uji3, name: "Teknisi Uji 3", username: "uji3" },
  { id: IDS.uji4, name: "Teknisi Uji 4", username: "uji4" },
];
const BY_SESI = { 1: TECHS[0], 2: TECHS[1], 3: TECHS[2] };

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

const KINDS = ["Chiller York Centrifugal", "Panel Utama Listrik", "Monitoring Ruang Pompa"];
const NOTES = [
  "Tekanan rendah, cek filter",
  "Suhu oli di atas normal",
  "Level air turun, perlu pengisian",
  "Ada bunyi tidak normal, perlu pengecekan",
  "Getaran pompa meningkat",
];

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

function todayWib() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}
function shiftDate(ds, delta) {
  const d = new Date(ds + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
const sql = (v) => "'" + String(v).replace(/'/g, "''") + "'";

const today = todayWib();
const rows = [];
const meta = [];
const schedules = [];
let createdSeq = 0;

for (let dayIdx = DAYS - 1; dayIdx >= 0; dayIdx--) {
  const date = shiftDate(today, -dayIdx);
  const shift2Tech = dayIdx % 7 === 3 ? TECHS[3] : TECHS[1];
  schedules.push(
    { date, shift_id: 1, user_id: TECHS[0].id },
    { date, shift_id: 2, user_id: shift2Tech.id },
    { date, shift_id: 3, user_id: TECHS[2].id }
  );
  KINDS.forEach((kind, kindIdx) => {
    const groups = labels[kind] || [];
    [1, 2, 3].forEach((sesi) => {
      const gate = mkRng(hash(date + "|" + kind + "|skip"))();
      if (sesi === 2 && gate < 0.06) return;
      if (sesi === 3 && gate < 0.12) return;
      const rnd = mkRng(hash(date + "|" + kind + "|" + sesi));
      const vals = {};
      for (const g of groups) {
        for (const [name, type] of g.items) {
          const key = g.group + "::" + name;
          if (type === "angka") vals[key] = pickNumber(name, rnd);
          else if (type === "HML" || type === "HL" || type === "AOM") vals[key] = pickChoice(type, rnd);
          else vals[key] = pickText(name, rnd);
        }
      }
      const needFollow = rnd() < 0.08;
      const tech = sesi === 2 ? (dayIdx % 7 === 3 ? TECHS[3] : TECHS[1]) : BY_SESI[sesi];
      const baseHour = [2, 5, 8][sesi - 1]; // UTC ≈ 09:00/12:00/15:00 WIB
      const minute = (createdSeq * 7 + dayIdx) % 60;
      const second = (createdSeq * 13) % 60;
      createdSeq++;
      const createdAt = date + "T" + String(baseHour).padStart(2, "0") + ":" + String(minute).padStart(2, "0") + ":" + String(second).padStart(2, "0") + ".000Z";
      rows.push({
        user_id: tech.id,
        date,
        kind,
        values_json: JSON.stringify(vals),
        created_at: createdAt,
        shift_id: sesi,
        status: needFollow ? "Perlu Tindak Lanjut" : "Sudah Diisi",
        follow_up_note: needFollow ? NOTES[(dayIdx + kindIdx) % NOTES.length] : "",
        sesi,
      });
      meta.push({ created_at: createdAt, date, kind, sesi, user_id: tech.id, tech: tech.name });
    });
  });
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const CHUNK = 24;
let fileNo = 0;
for (let k = 0; k < rows.length; k += CHUNK) {
  fileNo++;
  const part = rows.slice(k, k + CHUNK);
  const body = part.map((r) =>
    "INSERT OR IGNORE INTO checklists (user_id,date,kind,values_json,created_at,shift_id,status,follow_up_note,sesi) VALUES (" +
    [r.user_id, sql(r.date), sql(r.kind), sql(r.values_json), sql(r.created_at), r.shift_id, sql(r.status), sql(r.follow_up_note), r.sesi].join(",") +
    ");"
  ).join("\n");
  fs.writeFileSync(path.join(OUT, "seed_" + String(fileNo).padStart(2, "0") + ".sql"), body + "\n");
}
fs.writeFileSync(path.join(OUT, "seed-meta.json"), JSON.stringify(meta));

const schedSql = schedules.map((s) =>
  "INSERT OR IGNORE INTO schedules (user_id,shift_id,date) VALUES (" + s.user_id + "," + s.shift_id + "," + sql(s.date) + ");"
).join("\n");
fs.writeFileSync(path.join(OUT, "seed-schedules.sql"), schedSql + "\n");

const names = TECHS.map((t) => sql(t.username)).join(",");
const whereUsers = "user_id IN (SELECT id FROM users WHERE lower(username) IN (" + names + "))";
const cleanup = [
  "-- Menghapus seluruh data uji uji1 sampai uji4 dan akunnya.",
  "DELETE FROM checklist_history WHERE " + whereUsers + ";",
  "DELETE FROM checklists WHERE " + whereUsers + ";",
  "DELETE FROM schedules WHERE " + whereUsers + ";",
  "DELETE FROM users WHERE lower(username) IN (" + names + ");",
].join("\n");
fs.writeFileSync(path.join(OUT, "cleanup.sql"), cleanup + "\n");

const byDate = new Set(rows.map((r) => r.date));
console.log("hari:", byDate.size, "| rentang:", [...byDate].sort()[0], "->", [...byDate].sort().pop());
console.log("total record:", rows.length, "| file:", fileNo, "| folder:", OUT);
console.log("roster:", schedules.length, "baris | cleanup:", path.join(OUT, "cleanup.sql"));
for (const kind of KINDS) {
  const n = rows.filter((r) => r.kind === kind).length;
  const sample = rows.find((r) => r.kind === kind);
  console.log(" ", kind.padEnd(28), n, "record | contoh nilai:", Object.keys(JSON.parse(sample.values_json)).length, "item");
}
for (const t of TECHS) {
  console.log(" ", t.username, rows.filter((r) => r.user_id === t.id).length, "record");
}
