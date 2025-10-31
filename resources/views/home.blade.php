@extends('layout')

@section('title', 'Home - Single Vendor Doc')

@section('content')
<div class="bg-blue-600 text-white py-20">
    <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">Welcome to Single Vendor Doc</h1>
        <p class="text-xl mb-8">Your trusted healthcare documentation platform</p>
        <a href="/services" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Explore Services
        </a>
    </div>
</div>

<div class="max-w-7xl mx-auto px-4 py-16">
    <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
            <h3 class="text-xl font-semibold mb-4">Expert Care</h3>
            <p class="text-gray-600">Professional healthcare documentation services</p>
        </div>
        <div class="text-center">
            <h3 class="text-xl font-semibold mb-4">Secure Platform</h3>
            <p class="text-gray-600">Your data is protected with industry-standard security</p>
        </div>
        <div class="text-center">
            <h3 class="text-xl font-semibold mb-4">24/7 Support</h3>
            <p class="text-gray-600">Round-the-clock assistance when you need it</p>
        </div>
    </div>
</div>
@endsection