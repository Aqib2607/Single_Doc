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

- **PHP 8.1+** - Server-side scripting language
- **Composer** - PHP dependency manager
- **Node.js 16+** - JavaScript runtime
- **npm or bun** - Node.js package managers
- **MySQL 8.0+** - Database server
- **Git** - Version control (for cloning repository)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/Single_Doc.git
cd Single_Doc
```

### 2. Install All Dependencies

**CRITICAL: Install ALL dependencies before proceeding to avoid errors.**

#### Backend Dependencies (PHP/Laravel)

```bash
# Install PHP packages via Composer
composer install

# Key Laravel packages installed:
# - laravel/framework (^10.0)
# - laravel/sanctum (API authentication)
# - laravel/tinker (REPL)
```

#### Frontend Dependencies (Node.js/React)

```bash
# Install Node.js packages via npm
npm install

# OR using bun (faster alternative)
bun install

# Key packages installed:
# - react (^18.0) & react-dom
# - typescript (^5.0)
# - vite (^4.0) - Build tool
# - tailwindcss (^3.0) - CSS framework
# - @radix-ui/* - UI component primitives
# - lucide-react - Icon library
# - react-router-dom - Client-side routing
# - jquery - AJAX requests
```

#### Development Dependencies

```bash
# These are automatically installed with the above commands:
# - @types/react, @types/react-dom (TypeScript definitions)
# - @vitejs/plugin-react (Vite React plugin)
# - autoprefixer & postcss (CSS processing)
# - eslint & @typescript-eslint/* (Code linting)
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate Laravel application key
php artisan key:generate

# Set application URL (if different from default)
# Edit .env file and update:
# APP_URL=http://localhost:8000
```

### 4. Database Setup

#### Step 1: Create MySQL Database

```sql
# Connect to MySQL as root
mysql -u root -p

# Create database
CREATE DATABASE single_doc;

# Create user (optional, for security)
CREATE USER 'single_doc_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON single_doc.* TO 'single_doc_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 2: Configure Database Connection

Update `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=single_doc
DB_USERNAME=single_doc_user
DB_PASSWORD=your_password
```

#### Step 3: Run Database Migrations & Seeders

```bash
# Run all migrations to create tables
php artisan migrate

# Seed database with sample data
php artisan db:seed

# OR run both in one command
php artisan migrate --seed
```

#### Database Tables Created

- `users` - System users authentication
- `doctors` - Doctor profiles and specializations  
- `patients` - Patient profiles and medical info
- `appointments` - Appointment bookings (patient & guest)
- `prescriptions` - Medical prescriptions
- `medicines` - Available medicines catalog
- `tests` - Diagnostic tests catalog
- `schedules` - Doctor availability schedules
- `guests` - Guest appointment bookings

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
