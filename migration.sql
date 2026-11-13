-- Jalankan satu kali pada database Cloudflare D1 yang sudah berisi tabel versi lama.
ALTER TABLE checklists ADD COLUMN shift_id INTEGER REFERENCES shifts(id);
ALTER TABLE checklists ADD COLUMN status TEXT NOT NULL DEFAULT 'Sudah Diisi';
ALTER TABLE checklists ADD COLUMN follow_up_note TEXT NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS shifts (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL UNIQUE,
 start_time TEXT NOT NULL,
 end_time TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO shifts(name,start_time,end_time) VALUES
 ('Shift Pagi','07:00','15:00'),('Shift Sore','15:00','23:00'),('Shift Malam','23:00','07:00');
CREATE TABLE IF NOT EXISTS checklist_history (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 date TEXT NOT NULL, kind TEXT NOT NULL, shift_id INTEGER REFERENCES shifts(id),
 status TEXT NOT NULL, change_summary TEXT NOT NULL, old_values_json TEXT NOT NULL DEFAULT '{}', new_values_json TEXT NOT NULL DEFAULT '{}', changed_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_history_date ON checklist_history(date,changed_at);


