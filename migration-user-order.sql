-- Urutan baris teknisi pada tabel jadwal bulanan.
-- Jalankan satu kali. Nilai awal mengikuti urutan nama yang berlaku sebelumnya.
ALTER TABLE users ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
UPDATE users SET sort_order=(
  SELECT COUNT(*) FROM users u2
  WHERE u2.role=users.role AND (u2.name<users.name OR (u2.name=users.name AND u2.id<users.id))
)+1;
