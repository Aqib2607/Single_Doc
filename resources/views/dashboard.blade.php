@extends('layout')

@section('title', 'Dashboard - Single Vendor Doc')

@section('content')
<div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Welcome back, {{ auth()->user()->name }}!</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">Profile</h3>
            <p class="text-gray-600 mb-4">Manage your account information</p>
            <a href="/profile" class="text-blue-600 hover:text-blue-800">View Profile →</a>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">Documents</h3>
            <p class="text-gray-600 mb-4">Access your healthcare documents</p>
            <a href="#" class="text-blue-600 hover:text-blue-800">View Documents →</a>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">Settings</h3>
            <p class="text-gray-600 mb-4">Configure your preferences</p>
            <a href="/settings" class="text-blue-600 hover:text-blue-800">View Settings →</a>
        </div>
    </div>

    <div class="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
        <p class="text-gray-600">No recent activity to display.</p>
    </div>
</div>
@endsection