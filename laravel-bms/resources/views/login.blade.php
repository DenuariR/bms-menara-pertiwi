@extends('layouts.app')
@section('title', 'Login')

@section('content')
<div class="row justify-content-center">
    <div class="col-md-5">
        <div class="panel">
            <h2 class="h4 mb-3">Login</h2>
            <p class="text-muted">Masuk untuk mengisi checklist atau memonitor laporan.</p>
            @error('username')<div class="alert alert-danger py-2">{{ $message }}</div>@enderror
            <form method="POST" action="{{ route('login.post') }}">
                @csrf
                <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input name="username" class="form-control" autocomplete="username" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input name="password" type="password" class="form-control" autocomplete="current-password" required>
                </div>
                <button class="btn btn-primary w-100">Masuk</button>
            </form>
        </div>
    </div>
</div>
@endsection
