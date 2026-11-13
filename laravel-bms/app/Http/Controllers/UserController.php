<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        return view('admin.users', [
            'users' => User::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'username' => 'required|string|max:50|alpha_dash|unique:users,username',
            'password' => 'required|min:8',
            'role' => 'required|in:admin,user',
        ]);

        User::create($data);

        return back()->with('status', 'User '.$data['name'].' dibuat.');
    }

    public function destroy(User $user)
    {
        abort_if($user->id === Auth::id(), 403, 'Tidak bisa menghapus akun sendiri.');
        $user->delete();

        return back()->with('status', 'User dihapus.');
    }
}
