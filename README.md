# Single Doc - Medical Management System

A comprehensive medical management system built with Laravel (backend) and React + Vite (frontend) that provides functionality for doctors, patients, and medical administration.

## Features

- **Doctor Dashboard**: Manage appointments, prescriptions, medical records, and view medicines/tests
- **Patient Portal**: Book appointments, view prescriptions, access medical records
- **Medicine & Test Management**: View available medicines and diagnostic tests (read-only for doctors)
- **Appointment System**: Schedule and manage medical appointments
- **Prescription Management**: Create and manage patient prescriptions
- **Medical Records**: Store and access patient medical history
- **Authentication**: Secure login system for doctors and patients

## Tech Stack

### Backend

- **Laravel 10+** - PHP framework
- **MySQL** - Database
- **Laravel Sanctum** - API authentication

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Lucide React** - Icons

## Prerequisites

- PHP 8.1+
- Composer
- Node.js 16+
- npm or bun
- MySQL

## Installation

### 1. Install Dependencies

**IMPORTANT: Install dependencies first to avoid TypeScript module resolution errors.**

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
# or
bun install
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Setup

1. Create a MySQL database
2. Update `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=single_doc
DB_USERNAME=
DB_PASSWORD=
```

3. Run migrations and seeders:

```bash
php artisan migrate --seed
```

### 4. Start Development Servers

```bash
# Start Laravel backend (Terminal 1)
php artisan serve

# Start Vite frontend (Terminal 2)
npm run dev
# or
bun run dev
```

## Project Structure

```
Single_Doc/
├── app/                    # Laravel application
│   ├── Http/Controllers/   # API controllers
│   └── Models/            # Eloquent models
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/          # Database seeders
├── routes/
│   └── api.php           # API routes
├── src/                  # React frontend
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   └── lib/             # Utilities
└── public/              # Public assets
```

## API Endpoints

### Public Routes

- `GET /api/medicines` - List medicines
- `GET /api/tests` - List diagnostic tests
- `POST /api/login` - User authentication
- `POST /api/register` - User registration

### Protected Routes (require authentication)

- `GET /api/user` - Get current user
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription

## Development Notes

- The medicine and test management for doctors is **read-only** - CRUD operations have been removed
- TypeScript errors may occur if dependencies are not installed
- Run `npm install` or `bun install` before development
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:5173`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
