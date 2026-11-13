<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    protected $fillable = ['name', 'start_time', 'end_time'];

    /**
     * Apakah jam HH:MM (WIB) berada dalam rentang shift ini?
     * Mendukung shift yang melewati tengah malam (mis. 23:00-07:00).
     */
    public function covers(string $hhmm): bool
    {
        return $this->start_time <= $this->end_time
            ? $hhmm >= $this->start_time && $hhmm <= $this->end_time
            : $hhmm >= $this->start_time || $hhmm <= $this->end_time;
    }
}
