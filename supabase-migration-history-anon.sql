-- Pertahankan checklist_history saat akun teknisi dihapus.
-- Jalankan sekali pada database Supabase/Postgres yang sudah berisi data.

ALTER TABLE checklist_history DROP CONSTRAINT IF EXISTS checklist_history_user_id_fkey;
ALTER TABLE checklist_history ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE checklist_history ADD CONSTRAINT checklist_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
