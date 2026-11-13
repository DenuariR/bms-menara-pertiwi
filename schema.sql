PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 username TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL,
 salt TEXT NOT NULL,
 role TEXT NOT NULL CHECK(role IN ('admin','user')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS checklists (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 date TEXT NOT NULL,
 kind TEXT NOT NULL,
 values_json TEXT NOT NULL DEFAULT '{}',
 created_at TEXT NOT NULL,
 shift_id INTEGER REFERENCES shifts(id),
 status TEXT NOT NULL DEFAULT 'Sudah Diisi' CHECK(status IN ('Sudah Diisi','Perlu Tindak Lanjut')),
 follow_up_note TEXT NOT NULL DEFAULT '',
 sesi INTEGER NOT NULL DEFAULT 1 CHECK(sesi IN (1,2,3)),
 UNIQUE(user_id,date,kind,sesi)
);
CREATE INDEX IF NOT EXISTS idx_checklists_date ON checklists(date);

CREATE TABLE IF NOT EXISTS checklist_items (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 kind TEXT NOT NULL,
 label TEXT NOT NULL,
 sort_order INTEGER NOT NULL DEFAULT 0,
 active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_items_kind ON checklist_items(kind,active,sort_order);

-- Fitur shift, status checklist, dan audit trail
CREATE TABLE IF NOT EXISTS shifts (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL UNIQUE,
 start_time TEXT NOT NULL,
 end_time TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO shifts(name,start_time,end_time) VALUES
 ('Shift Pagi','07:00','15:00'),
 ('Shift Sore','15:00','23:00'),
 ('Shift Malam','23:00','07:00');

-- Kolom tambahan untuk instalasi baru. Untuk database lama jalankan migration.sql.

CREATE TABLE IF NOT EXISTS checklist_history (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 date TEXT NOT NULL, kind TEXT NOT NULL, shift_id INTEGER REFERENCES shifts(id),
 status TEXT NOT NULL, change_summary TEXT NOT NULL, old_values_json TEXT NOT NULL DEFAULT '{}', new_values_json TEXT NOT NULL DEFAULT '{}', changed_at TEXT NOT NULL, sesi INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_history_date ON checklist_history(date,changed_at);

-- Rate limit percobaan login per IP (jendela 1 menit)
CREATE TABLE IF NOT EXISTS login_attempts (
 ip TEXT NOT NULL,
 minute TEXT NOT NULL,
 count INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY(ip,minute)
);
-- Jadwal teknisi per shift (roster)
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_id INTEGER NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  UNIQUE(user_id, shift_id, date)
);
CREATE INDEX IF NOT EXISTS idx_schedules_date_shift ON schedules(date, shift_id);

-- Batasi user ke satu shift tertentu (NULL = bebas semua shift)
ALTER TABLE users ADD COLUMN allowed_shift_id INTEGER;
