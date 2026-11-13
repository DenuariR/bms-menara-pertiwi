-- Jadwal teknisi per shift (roster)
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_id INTEGER NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  UNIQUE(user_id, shift_id, date)
);
CREATE INDEX IF NOT EXISTS idx_schedules_date_shift ON schedules(date, shift_id);
