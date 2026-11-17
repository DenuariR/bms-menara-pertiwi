-- Menghapus seluruh data uji uji1 sampai uji4 dan akunnya.
DELETE FROM checklist_history WHERE user_id IN (SELECT id FROM users WHERE lower(username) IN ('uji1','uji2','uji3','uji4'));
DELETE FROM checklists WHERE user_id IN (SELECT id FROM users WHERE lower(username) IN ('uji1','uji2','uji3','uji4'));
DELETE FROM schedules WHERE user_id IN (SELECT id FROM users WHERE lower(username) IN ('uji1','uji2','uji3','uji4'));
DELETE FROM users WHERE lower(username) IN ('uji1','uji2','uji3','uji4');
