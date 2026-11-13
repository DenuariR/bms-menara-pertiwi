<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use App\Models\ChecklistHistory;
use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ChecklistController extends Controller
{
    private function kinds(): array
    {
        return array_keys(config('checklist.kinds'));
    }

    private function wibNow(): Carbon
    {
        return Carbon::now('Asia/Jakarta');
    }

    private function validKeys(string $kind): array
    {
        $keys = [];
        foreach (config("checklist.kinds.$kind") as $group) {
            foreach ($group['items'] as $item) {
                $keys[] = $group['group'].'::'.$item;
            }
        }

        return $keys;
    }

    public function index()
    {
        $user = Auth::user();
        $kinds = config('checklist.kinds');

        return view('checklist.index', [
            'kinds' => $kinds,
            'shifts' => Shift::orderBy('id')->get(),
            'myChecklists' => $user->checklists()
                ->with('shift')->orderByDesc('date')->orderBy('sesi')->limit(100)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'kind' => 'required|in:'.implode(',', $this->kinds()),
            'shift_id' => 'required|exists:shifts,id',
            'sesi' => 'required|integer|in:1,2,3',
            'status' => 'required|in:'.implode(',', config('checklist.statuses')),
            'follow_up_note' => 'nullable|string|max:1000',
        ]);

        // Validasi waktu: bebas mengisi kapan pun SELAMA rentang shift berjalan (WIB)
        $shift = Shift::findOrFail($validated['shift_id']);
        $hhmm = $this->wibNow()->format('H:i');
        if (! $shift->covers($hhmm)) {
            return back()
                ->withInput()
                ->withErrors(['sesi' => "Jam pengisian di luar jadwal {$shift->name} ({$shift->start_time}-{$shift->end_time} WIB)."]);
        }

        // Saring values: hanya key "<grup>::<item>" yang valid untuk jenis ini
        $allowed = $this->validKeys($validated['kind']);
        $values = array_intersect_key(
            (array) $request->input('values', []),
            array_flip($allowed)
        );

        $checklist = Checklist::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'kind' => $validated['kind'],
                'sesi' => $validated['sesi'],
            ],
            [
                'shift_id' => $validated['shift_id'],
                'values' => $values,
                'status' => $validated['status'],
                'follow_up_note' => $validated['follow_up_note'] ?? null,
            ]
        );

        ChecklistHistory::create([
            'checklist_id' => $checklist->id,
            'user_id' => Auth::id(),
            'action' => $checklist->wasRecentlyCreated ? ChecklistHistory::CREATED : ChecklistHistory::UPDATED,
            'changes' => $values,
        ]);

        return back()->with('status', 'Checklist tersimpan (Sesi '.$validated['sesi'].').');
    }
}
