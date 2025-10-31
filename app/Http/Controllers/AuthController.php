<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Patient;
use App\Models\Doctor;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'user_type' => 'required|in:patient,doctor',
        ]);

        $guard = $credentials['user_type'];
        unset($credentials['user_type']);

        if (Auth::guard($guard)->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'Invalid credentials.',
        ]);
    }

    public function showRegister()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|confirmed',
            'user_type' => 'required|in:patient,doctor',
        ]);

        $userType = $validated['user_type'];
        unset($validated['user_type']);
        $validated['password'] = Hash::make($validated['password']);

        if ($userType === 'patient') {
            // Add unique validation for patients table
            $request->validate(['email' => 'unique:patients']);
            $user = Patient::create($validated);
            Auth::guard('patient')->login($user);
        } else {
            // Add unique validation for doctors table
            $request->validate(['email' => 'unique:doctors']);
            $user = Doctor::create($validated);
            Auth::guard('doctor')->login($user);
        }

        return redirect('/dashboard');
    }

    public function logout(Request $request)
    {
        if (Auth::guard('patient')->check()) {
            Auth::guard('patient')->logout();
        } elseif (Auth::guard('doctor')->check()) {
            Auth::guard('doctor')->logout();
        }
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}