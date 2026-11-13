@extends('layouts.app')
@section('title', 'Riwayat Perubahan')

@section('content')
<div class="panel">
    <h2 class="h4">Riwayat Perubahan Checklist</h2>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Jenis / Tanggal</th><th>Perubahan</th></tr></thead>
            <tbody>
            @forelse($histories as $h)
                <tr>
                    <td>{{ $h->created_at->format('Y-m-d H:i') }}</td>
                    <td>{{ $h->user?->name }}</td>
                    <td>{{ $h->action }}</td>
                    <td>{{ $h->checklist?->kind }} · {{ $h->checklist?->date?->toDateString() }} (S{{ $h->checklist?->sesi }})</td>
                    <td><small>{{ collect($h->changes ?? [])->map(fn($v, $k) => "$k: $v")->implode('; ') }}</small></td>
                </tr>
            @empty
                <tr><td colspan="5" class="text-muted">Belum ada riwayat</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
