<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Checklist extends Model
{
    protected $fillable = [
        'user_id', 'shift_id', 'date', 'kind', 'sesi',
        'values', 'status', 'follow_up_note',
    ];

    protected function casts(): array
    {
        return ['values' => 'array', 'date' => 'date'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }
}
