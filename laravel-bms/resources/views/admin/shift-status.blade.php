@extends('layouts.app')
@section('title', 'Yang Belum Mengisi')

@section('content')
<div class="panel">
    <h2 class="h4">Pemberitahuan: Yang Belum Mengisi</h2>
    <p class="text-muted">Per tanggal & shift: sesi dan jenis monitoring yang belum diisi tiap teknisi ({{ count($report) ? $report[0]['total'] : 9 }} = 3 jenis x 3 sesi).</p>
    <form method="GET" class="row g-2 mb-3">
        @csrf
        <div class="col-md-3"><label class="form-label">Tanggal</label>
            <input type="date" name="date" value="{{ $date }}" class="form-control"></div>
        <div class="col-md-4"><label class="form-label">Shift</label>
            <select name="shift_id" class="form-select">
                @foreach($shifts as $s)
                    <option value="{{ $s->id }}" {{ $s->id === $shift->id ? 'selected' : '' }}>
                        {{ $s->name }} ({{ $s->start_time }}-{{ $s->end_time }})
                    </option>
                @endforeach
            </select></div>
        <div class="col-md-2 d-grid"><button class="btn btn-primary">Cek</button></div>
    </form>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead><tr><th>Teknisi</th><th>Terisi</th><th>Yang Belum Diisi</th></tr></thead>
            <tbody>
            @foreach($report as $r)
                <tr>
                    <td>{{ $r['name'] }}</td>
                    <td>{{ $r['filled'] }}/{{ $r['total'] }}</td>
                    <td>
                        @if(count($r['missing']))
                            <span class="state-warning">
                                {{ collect($r['missing'])->map(fn($m) => 'Sesi '.$m['sesi'].' · '.$m['kind'])->implode(', ') }}
                            </span>
                        @else
                            <span class="state-normal">✔ Lengkap semua sesi</span>
                        @endif
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
