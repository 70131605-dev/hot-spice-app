<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Admin Login</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: #fff; padding: 32px; border-radius: 10px; box-shadow: 0 1px 8px rgba(0,0,0,0.15); width: 320px; }
        h1 { color: #E4002B; margin-top: 0; font-size: 22px; text-align: center; }
        label { font-size: 13px; color: #555; display: block; margin-bottom: 4px; margin-top: 14px; }
        input[type=email], input[type=password], input[type=text].password-field { width: 100%; padding: 8px 34px 8px 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
        button { width: 100%; background: #E4002B; color: #fff; border: none; padding: 10px; border-radius: 6px; cursor: pointer; margin-top: 20px; font-size: 15px; }
        .error { background: #ffe3e3; color: #b3001b; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-top: 14px; }
        .password-wrap { position: relative; }
        .toggle-password { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: none; border: none; padding: 4px; margin: 0; width: auto; cursor: pointer; color: #777; display: flex; }
        .toggle-password:hover { color: #333; }
        .toggle-password svg { width: 18px; height: 18px; }
        .toggle-password .icon-off { display: none; }
        .password-wrap.visible .icon-on { display: none; }
        .password-wrap.visible .icon-off { display: block; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🍔 Hot & Spice — Admin</h1>
        @if ($errors->any())
            <div class="error">{{ $errors->first() }}</div>
        @endif
        <form action="/admin/login" method="POST">
            @csrf
            <label>Email</label>
            <input type="email" name="email" value="{{ old('email') }}" required autofocus>
            <label>Password</label>
            <div class="password-wrap">
                <input type="password" name="password" id="password" class="password-field" required>
                <button type="button" class="toggle-password" onclick="togglePassword()" aria-label="Show password">
                    <svg class="icon-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg class="icon-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>
                </button>
            </div>
            <button type="submit">Log In</button>
        </form>
    </div>
    <script>
        function togglePassword() {
            const input = document.getElementById('password');
            const wrap = input.closest('.password-wrap');
            const willShow = input.type === 'password';
            input.type = willShow ? 'text' : 'password';
            wrap.classList.toggle('visible', willShow);
            wrap.querySelector('.toggle-password').setAttribute('aria-label', willShow ? 'Hide password' : 'Show password');
        }
    </script>
</body>
</html>
