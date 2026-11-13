<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'BMS Menara Pertiwi')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f4f7fb; }
        .app-header { background: linear-gradient(115deg, #0b2239, #145b78); }
        .panel { background: #fff; border: 1px solid #e7edf4; border-radius: 14px; padding: 20px; margin-bottom: 18px; box-shadow: 0 5px 22px rgba(16,42,67,.05); }
        .stats { font-size: 28px; font-weight: 750; color: #145b78; }
        .state-normal { color: #067647; } .state-warning { color: #b54708; } .state-critical { color: #b42318; }
    </style>
</head>
<body>
<nav class="app-header navbar navbar-dark px-3">
    <span class="navbar-brand fw-bold">BMS MENARA PERTIWI</span>
    @auth
        <div class="d-flex gap-2 align-items-center text-white">
            <small>{{ auth()->user()->name }} ({{ auth()->user()->role }})</small>
            <form action="{{ route('logout') }}" method="POST">@csrf
                <button class="btn btn-outline-light btn-sm">Keluar</button>
            </form>
        </div>
    @endauth
</nav>
<main class="container my-4" style="max-width: 1200px">
    @if (session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif
    @yield('content')
</main>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
