<?php

namespace Database\Seeders;

use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'username' => 'Admin',
            'password' => 'GantiPasswordSaya2026',
            'role' => 'admin',
        ]);

        foreach ([
            ['Shift Pagi', '07:00', '15:00'],
            ['Shift Sore', '15:00', '23:00'],
            ['Shift Malam', '23:00', '07:00'],
        ] as [$name, $start, $end]) {
            Shift::create(['name' => $name, 'start_time' => $start, 'end_time' => $end]);
        }

        // Contoh user teknisi (ganti/hapus sesuai kebutuhan)
        foreach ([
            ['Rudi Hartono', 'rudi'],
            ['Andi Pratama', 'andi'],
            ['Dewi Lestari', 'dewi'],
        ] as [$name, $username]) {
            User::create([
                'name' => $name,
                'username' => $username,
                'password' => 'teknisi123',
                'role' => 'user',
            ]);
        }
    }
}
