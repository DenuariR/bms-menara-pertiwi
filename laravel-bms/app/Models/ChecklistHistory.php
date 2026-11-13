<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChecklistHistory extends Model
{
    public const CREATED = 'created';
    public const UPDATED = 'updated';

    protected $fillable = [
        'checklist_id', 'user_id', 'action',
        'changes', 'before', 'after',
    ];

    protected function casts(): array
    {
        return ['changes' => 'array', 'before' => 'array', 'after' => 'array'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }
}
