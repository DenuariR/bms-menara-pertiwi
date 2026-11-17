-- Migrasi: parameter jenis data untuk item checklist (teks / angka)
ALTER TABLE checklist_items ADD COLUMN item_type TEXT NOT NULL DEFAULT 'teks';
