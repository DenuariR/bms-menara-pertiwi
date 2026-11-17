-- Status libur teknisi per tanggal, terpisah dari roster shift.
CREATE TABLE IF NOT EXISTS schedule_off (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  UNIQUE(user_id, date)
);
CREATE INDEX IF NOT EXISTS idx_schedule_off_date ON schedule_off(date);
