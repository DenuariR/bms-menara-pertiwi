-- Jalankan satu kali: pengisian checklist per sesi (3 sesi per shift).
-- Tabel lama + data dipertahankan; kolom sesi ditambahkan (default 1).
CREATE TABLE checklists_new (
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
INSERT INTO checklists_new(id,user_id,date,kind,values_json,created_at,shift_id,status,follow_up_note,sesi)
 SELECT id,user_id,date,kind,values_json,created_at,shift_id,status,follow_up_note,1 FROM checklists;
DROP TABLE checklists;
ALTER TABLE checklists_new RENAME TO checklists;
CREATE INDEX IF NOT EXISTS idx_checklists_date ON checklists(date);
ALTER TABLE checklist_history ADD COLUMN sesi INTEGER NOT NULL DEFAULT 1;

-- Batasi user ke satu shift tertentu (NULL = bebas semua shift)
ALTER TABLE users ADD COLUMN allowed_shift_id INTEGER;
