@echo off
echo Setting up database...

echo Running migrations...
php artisan migrate --force

echo Seeding blog data...
php artisan db:seed --class=BlogSeeder

echo Database setup complete!
pause