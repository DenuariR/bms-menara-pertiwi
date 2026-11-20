-- Pertahankan checklist_history saat akun teknisi dihapus.
-- Jalankan sekali pada database D1 yang sudah berisi data.

CREATE TABLE IF NOT EXISTS checklist_history_new (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
 date TEXT NOT NULL, kind TEXT NOT NULL, shift_id INTEGER REFERENCES shifts(id),
 status TEXT NOT NULL, change_summary TEXT NOT NULL, old_values_json TEXT NOT NULL DEFAULT '{}', new_values_json TEXT NOT NULL DEFAULT '{}', changed_at TEXT NOT NULL, sesi INTEGER NOT NULL DEFAULT 1
);

INSERT INTO checklist_history_new (id,user_id,date,kind,shift_id,status,change_summary,old_values_json,new_values_json,changed_at,sesi)
SELECT id,user_id,date,kind,shift_id,status,change_summary,old_values_json,new_values_json,changed_at,sesi FROM checklist_history;

DROP TABLE checklist_history;
ALTER TABLE checklist_history_new RENAME TO checklist_history;
CREATE INDEX IF NOT EXISTS idx_history_date ON checklist_history(date,changed_at);
