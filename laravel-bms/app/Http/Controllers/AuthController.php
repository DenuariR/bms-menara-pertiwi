<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Auth::check() ? redirect()->route('dashboard') : view('login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Rate limit sederhana: 10 percobaan per menit per sesi
        $key = 'login:'.session()->getId();
        if (RateLimiter::tooManyAttempts($key, 10)) {
            return back()->withErrors(['username' => 'Terlalu banyak percobaan. Tunggu sebentar.']);
        }
        RateLimiter::hit($key, 60);

        if (! Auth::attempt($credentials + ['remember' => true])) {
            return back()->withErrors(['username' => 'Username atau password salah.']);
        }

        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
