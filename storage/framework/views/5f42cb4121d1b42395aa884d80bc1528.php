<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $__env->yieldContent('title', 'Single Vendor Doc'); ?></title>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
</head>
<body>
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="text-xl font-bold">Single Vendor Doc</a>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-700 hover:text-blue-600">Home</a>
                    <a href="/about" class="text-gray-700 hover:text-blue-600">About</a>
                    <a href="/services" class="text-gray-700 hover:text-blue-600">Services</a>
                    <a href="/contact" class="text-gray-700 hover:text-blue-600">Contact</a>
                    <?php if(auth()->guard()->check()): ?>
                        <a href="/dashboard" class="text-gray-700 hover:text-blue-600">Dashboard</a>
                        <form method="POST" action="/logout" class="inline">
                            <?php echo csrf_field(); ?>
                            <button type="submit" class="text-gray-700 hover:text-blue-600">Logout</button>
                        </form>
                    <?php else: ?>
                        <a href="/login" class="text-gray-700 hover:text-blue-600">Login</a>
                        <a href="/register" class="bg-blue-600 text-white px-4 py-2 rounded">Register</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <main>
        <?php echo $__env->yieldContent('content'); ?>
    </main>

    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 Single Vendor Doc. All rights reserved.</p>
        </div>
    </footer>
</body>
</html><?php /**PATH C:\Users\Aqib\Downloads\Single_Vendor_Doc\resources\views/layout.blade.php ENDPATH**/ ?>