@extends('layouts.app')
@section('title', 'Dashboard')

@section('content')
<div class="panel">
    <h2 class="h4">Halo, {{ $user->name }}</h2>
    <div class="d-flex flex-wrap gap-2 mt-3">
        <a href="{{ route('checklist.index') }}" class="btn btn-primary">Isi Checklist</a>
        @if($user->isAdmin())
            <a href="{{ route('admin.shift-status') }}" class="btn btn-outline-primary">Yang Belum Mengisi</a>
            <a href="{{ route('admin.histories') }}" class="btn btn-outline-primary">Riwayat Perubahan</a>
            <a href="{{ route('admin.users.index') }}" class="btn btn-outline-primary">Kelola User</a>
        @endif
    </div>
</div>

<div class="panel">
    <h2 class="h5">Ganti Password</h2>
    <form method="POST" action="{{ route('password.update') }}" class="row g-2 align-items-end">
        @csrf @method('PATCH')
        <div class="col-md-4"><label class="form-label">Password saat ini</label>
            <input name="current_password" type="password" class="form-control" required></div>
        <div class="col-md-4"><label class="form-label">Password baru</label>
            <input name="password" type="password" class="form-control" minlength="8" required></div>
        <div class="col-md-3"><label class="form-label">Ulangi password baru</label>
            <input name="password_confirmation" type="password" class="form-control" minlength="8" required></div>
        <div class="col-md-1"><button class="btn btn-primary w-100">Ganti</button></div>
    </form>
    @error('current_password')<small class="text-danger">{{ $message }}</small>@enderror
</div>
@endsection
