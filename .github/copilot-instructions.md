# Single Doc - AI Agent Instructions

## Architecture Overview

This is a **hybrid Laravel-React health platform** with Laravel backend (API) and Vite-built React frontend coexisting in the same repo. The project serves multiple healthcare professionals (doctors, nutritionists, life coaches) and patients through a unified platform.

### Key Architecture Patterns

- **Dual Authentication Models**: Separate `Doctor` and `Patient` models extending `Authenticatable` (not a single User model)
- **API-First Design**: Frontend consumes Laravel Sanctum-protected API routes in `routes/api.php`
- **Hybrid Build Strategy**: React builds into Laravel's `public/` directory for unified deployment
- **Multi-Role System**: Doctor dashboard (`/doctor/*`), Patient dashboard, Guest booking system

## Critical Development Workflows

### Environment Setup
```bash
# Backend dependencies
composer install
php artisan key:generate
php artisan migrate --seed

# Frontend dependencies (prefer bun for speed)
bun install  # or npm install
bun run dev  # starts Vite dev server on :8080
php artisan serve  # starts Laravel API on :8000
```

### Database Architecture
- **Primary Keys**: Use `doctor_id`, `patient_id` (not standard `id`) for main models
- **Auth Tables**: Separate `doctors` and `patients` tables, no unified `users` table
- **Appointment System**: Supports guest bookings, video consultation links, multiple consultation types
- **Prescription System**: Complex relations via `prescription_medicines` and `prescription_tests` pivot tables

## Project-Specific Conventions

### Backend (Laravel)
- **Controllers**: Namespaced under `App\Http\Controllers\Api\*` for all API endpoints
- **Authentication**: Custom dual-model auth in `AuthController` - checks Patient first, then Doctor
- **Models**: Use specific IDs (`$primaryKey = 'doctor_id'`) and explicit fillable arrays
- **API Routes**: All routes in `routes/api.php`, no web routes for frontend functionality

### Frontend (React + TypeScript)
- **Route Structure**: Lazy-loaded pages with role-based routing (`/doctor/*`, `/patient/*`)
- **Contexts**: `AuthContext` handles dual-role authentication, `CartProvider` for appointments
- **UI Framework**: Shadcn/ui components with Radix primitives, Tailwind for styling
- **API Service**: Uses axios with token-based auth, services in `src/services/`

## Integration Points

### Google Meet Integration
- Environment variables: `GOOGLE_MEET_CLIENT_ID`, `GOOGLE_MEET_CLIENT_SECRET`
- Appointment booking automatically generates video consultation links
- Integration code in appointment controllers

### Video Course System
- Video storage path: `storage/courses/videos`
- Support for YouTube/Vimeo embedding via `YouTubeVideo.tsx` component
- Course management tied to professional profiles

### Frontend-Backend Communication
- **API Base**: Frontend dev server (`:8080`) proxies API calls to Laravel (`:8000`)
- **Authentication**: Sanctum tokens stored in localStorage, sent via Authorization header
- **Error Handling**: Standardized JSON error responses from Laravel controllers

## Key Files and Patterns

### Authentication Flow
- `src/contexts/AuthContext.tsx` - Dual-role auth state management
- `app/Http/Controllers/Api/AuthController.php` - Custom login logic for doctors/patients
- Login attempts Patient model first, then Doctor model

### Database Models
- `app/Models/Doctor.php` - Uses `doctor_id` primary key, `HasApiTokens` for Sanctum
- `app/Models/Patient.php` - Uses `patient_id` primary key, separate auth guard
- `app/Models/Appointment.php` - Complex booking system with guest support

### Build Configuration
- `vite.config.ts` - Manual chunking strategy for optimal loading
- Frontend builds to Laravel's `public/build/` directory in production
- Dev mode: separate servers with proxy configuration

## Development Commands

```bash
# Run both servers (development)
php artisan serve &  # Backend API
bun run dev         # Frontend with HMR

# Database operations
php artisan migrate:fresh --seed  # Reset with sample data
php artisan tinker                # Laravel REPL for testing

# Build for production
bun run build      # Builds React to public/build/
php artisan optimize  # Laravel optimization
```

## Testing and Debugging

- **Debug Routes**: `/api/debug-*` endpoints for authentication testing
- **Laravel Logs**: Check `storage/logs/` for backend errors
- **Frontend Dev Tools**: React DevTools, console for API responses
- **Database**: Use `php artisan tinker` to inspect models and relationships

## Common Pitfalls

- **Primary Keys**: Always use `doctor_id`/`patient_id`, not `id` when referencing these models
- **Authentication**: Remember dual-model system - Patient and Doctor are separate authenticatable models
- **API Calls**: Frontend must include Sanctum token in Authorization header
- **Build Process**: React build outputs to `public/build/`, not `dist/`
- **Environment**: Different ports for dev (API :8000, Frontend :8080)

## Extensions and Customization

The platform is designed for adding new professional types (nutritionists, coaches) by:
1. Creating new model extending `Authenticatable` with custom primary key
2. Adding API routes and controllers under `Api/` namespace  
3. Creating dedicated dashboard pages in `src/pages/`
4. Updating authentication system to support the new role
