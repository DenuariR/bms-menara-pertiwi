@extends('layouts.app')
@section('title', 'Checklist Harian')

@section('content')
<div class="panel">
    <h2 class="h4">Input Checklist</h2>
    <p class="text-muted">Sesi hanya label record (Sesi 1/2/3 terpisah) — bebas mengisi kapan pun selama rentang shift berjalan (WIB).</p>
    @error('sesi')<div class="alert alert-warning py-2">{{ $message }}</div>@enderror
    <form method="POST" action="{{ route('checklist.store') }}">
        @csrf
        <div class="row g-2 mb-3">
            <div class="col-md-3"><label class="form-label">Tanggal</label>
                <input type="date" name="date" value="{{ \Carbon\Carbon::today('Asia/Jakarta')->toDateString() }}" class="form-control" required></div>
            <div class="col-md-4"><label class="form-label">Jenis monitoring</label>
                <select name="kind" id="kind" class="form-select">
                    @foreach(array_keys($kinds) as $k)<option>{{ $k }}</option>@endforeach
                </select></div>
            <div class="col-md-3"><label class="form-label">Shift</label>
                <select name="shift_id" class="form-select">
                    @foreach($shifts as $s)<option value="{{ $s->id }}">{{ $s->name }} ({{ $s->start_time }}-{{ $s->end_time }})</option>@endforeach
                </select></div>
            <div class="col-md-2"><label class="form-label">Sesi</label>
                <select name="sesi" class="form-select"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div>
        </div>

        @foreach($kinds as $kindName => $groups)
            <div class="kind-block {{ $loop->first ? '' : 'd-none' }}" data-kind="{{ $kindName }}">
                @foreach($groups as $group)
                    <h6 class="mt-3 text-primary">{{ $group['group'] }}</h6>
                    <div class="row g-2">
                        @foreach($group['items'] as $item)
                            <div class="col-md-3">
                                <label class="form-label">{{ $item }}</label>
                                <input class="form-control" name="values[{{ $group['group'] }}::{{ $item }}]">
                            </div>
                        @endforeach
                    </div>
                @endforeach
            </div>
        @endforeach

        <div class="row g-2 mt-3">
            <div class="col-md-4"><label class="form-label">Status</label>
                <select name="status" class="form-select">
                    @foreach(config('checklist.statuses') as $st)<option>{{ $st }}</option>@endforeach
                </select></div>
            <div class="col-md-8"><label class="form-label">Catatan tindak lanjut (opsional)</label>
                <input name="follow_up_note" class="form-control"></div>
        </div>
        <button class="btn btn-primary mt-3">Simpan Checklist</button>
    </form>
</div>

<div class="panel">
    <h2 class="h5">Riwayat Checklist Saya</h2>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead><tr><th>Tanggal</th><th>Sesi</th><th>Shift</th><th>Jenis</th><th>Status</th><th>Terisi</th></tr></thead>
            <tbody>
            @forelse($myChecklists as $c)
                <tr>
                    <td>{{ $c->date->toDateString() }}</td>
                    <td>S{{ $c->sesi }}</td>
                    <td>{{ $c->shift?->name ?? '-' }}</td>
                    <td>{{ $c->kind }}</td>
                    <td><span class="{{ $c->status === 'Perlu Tindak Lanjut' ? 'state-warning' : 'state-normal' }}">{{ $c->status }}</span></td>
                    <td>{{ count($c->values ?? []) }} nilai</td>
                </tr>
            @empty
                <tr><td colspan="6" class="text-muted">Belum ada checklist terisi</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>
</div>

@push('scripts')
<script>
document.getElementById('kind').addEventListener('change', e => {
    document.querySelectorAll('.kind-block').forEach(b =>
        b.classList.toggle('d-none', b.dataset.kind !== e.target.value));
});
</script>
@endpush
@endsection
