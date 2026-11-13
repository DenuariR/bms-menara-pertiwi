<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use App\Models\ChecklistHistory;
use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return view('dashboard', [
            'user' => $user,
            'kinds' => config('checklist.kinds'),
        ]);
    }

    /** Pemberitahuan admin: siapa yang belum mengisi, per sesi & jenis. */
    public function shiftStatus(Request $request)
    {
        $date = $request->input('date', Carbon::today('Asia/Jakarta')->toDateString());
        $shiftId = (int) $request->input('shift_id');

        $shift = Shift::findOrFail($shiftId);
        $users = \App\Models\User::where('role', 'user')->orderBy('name')->get();
        $kinds = array_keys(config('checklist.kinds'));

        $filled = Checklist::where('date', $date)
            ->where('shift_id', $shiftId)
            ->get(['user_id', 'sesi', 'kind'])
            ->groupBy('user_id');

        $report = $users->map(function ($u) use ($filled, $kinds) {
            $mine = $filled->get($u->id, collect())
                ->map(fn ($c) => $c->sesi.'|'.$c->kind)->all();
            $missing = [];
            foreach ([1, 2, 3] as $s) {
                foreach ($kinds as $k) {
                    if (! in_array("$s|$k", $mine)) {
                        $missing[] = ['sesi' => $s, 'kind' => $k];
                    }
                }
            }

            return [
                'name' => $u->name,
                'total' => count($kinds) * 3,
                'filled' => count($kinds) * 3 - count($missing),
                'missing' => $missing,
            ];
        });

        return view('admin.shift-status', [
            'date' => $date,
            'shift' => $shift,
            'shifts' => Shift::orderBy('id')->get(),
            'report' => $report,
        ]);
    }

    public function histories()
    {
        return view('admin.histories', [
            'histories' => ChecklistHistory::with(['user', 'checklist'])
                ->orderByDesc('id')->limit(200)->get(),
        ]);
    }
}
