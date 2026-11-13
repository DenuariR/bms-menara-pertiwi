@extends('layouts.app')
@section('title', 'Kelola User')

@section('content')
<div class="panel">
    <h2 class="h4">Kelola User</h2>
    <form method="POST" action="{{ route('admin.users.store') }}" class="row g-2 align-items-end mb-3">
        @csrf
        <div class="col-md-3"><label class="form-label">Nama</label><input name="name" class="form-control" required></div>
        <div class="col-md-3"><label class="form-label">Username</label><input name="username" class="form-control" required></div>
        <div class="col-md-3"><label class="form-label">Password</label><input name="password" type="password" minlength="8" class="form-control" required></div>
        <div class="col-md-2"><label class="form-label">Role</label>
            <select name="role" class="form-select"><option value="user">user</option><option value="admin">admin</option></select></div>
        <div class="col-md-1 d-grid"><button class="btn btn-primary">Buat</button></div>
    </form>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead><tr><th>Nama</th><th>Username</th><th>Role</th><th>Aksi</th></tr></thead>
            <tbody>
            @foreach($users as $u)
                <tr>
                    <td>{{ $u->name }}</td><td>{{ $u->username }}</td><td>{{ $u->role }}</td>
                    <td>
                        <form action="{{ route('admin.users.destroy', $u) }}" method="POST">
                            @csrf @method('DELETE')
                            <button class="btn btn-outline-danger btn-sm">Hapus</button>
                        </form>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
