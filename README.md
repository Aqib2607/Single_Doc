# Single Doc - Comprehensive Health & Wellness Platform

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/Aqib2607/Single_Doc?style=for-the-badge&logo=github)
![GitHub stars](https://img.shields.io/github/stars/Aqib2607/Single_Doc?style=for-the-badge&logo=github)
![GitHub forks](https://img.shields.io/github/forks/Aqib2607/Single_Doc?style=for-the-badge&logo=github)
![GitHub issues](https://img.shields.io/github/issues/Aqib2607/Single_Doc?style=for-the-badge&logo=github)
![GitHub license](https://img.shields.io/github/license/Aqib2607/Single_Doc?style=for-the-badge&logo=github)

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

## 📊 Repository Stats

<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=Aqib2607&repo=Single_Doc&show_icons=true&theme=radical)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=Aqib2607&layout=compact&theme=radical)

</div>

## 🚀 Overview

A complete health and wellness management system built with Laravel (backend) and React + Vite (frontend) that connects patients with healthcare professionals, nutritionists, life coaches, and wellness experts.

## ✨ Features

### Core Medical Services

- **Doctor Dashboard**: Manage appointments, prescriptions, medical records, and view medicines/tests
- **Patient Portal**: Book appointments, view prescriptions, access medical records
- **Medicine & Test Management**: View available medicines and diagnostic tests
- **Prescription Management**: Create and manage patient prescriptions
- **Medical Records**: Store and access patient medical history

### Wellness & Coaching Services

- **Nutritionist Services**: Personalized nutrition plans and dietary consultations
- **Life Coaching**: Personal development and goal-setting sessions
- **Specialized Coaching**: Fitness, career, relationship, and wellness coaching

### Advanced Features

- **Video Consultations**: Integrated Google Meet links for remote sessions
- **Course Management**: Educational content and video courses
- **Todo Lists**: Collaborative task management between clients and professionals
- **Multi-Professional Platform**: Support for various healthcare and wellness professionals
- **Authentication**: Secure login system for all user types

## 🛠️ Tech Stack

### Backend

- **Laravel 10+** - PHP framework
- **MySQL** - Database
- **Laravel Sanctum** - API authentication
- **Google Meet API** - Video consultation integration

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Lucide React** - Icons
- **Video.js** - Video course player

### Integrations

- **Google Meet** - Video consultations
- **YouTube/Vimeo** - Course video hosting
- **Real-time notifications** - Appointment and task updates

## 📋 Prerequisites

- **PHP 8.1+** - Server-side scripting language
- **Composer** - PHP dependency manager
- **Node.js 16+** - JavaScript runtime
- **npm or bun** - Node.js package managers
- **MySQL 8.0+** - Database server
- **Git** - Version control (for cloning repository)

## 🚀 Installation

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

**Core Tables**

- `users` - System users authentication
- `patients` - Patient profiles and medical info
- `appointments` - Appointment bookings with video links
- `prescriptions` - Medical prescriptions
- `medicines` - Available medicines catalog
- `tests` - Diagnostic tests catalog
- `schedules` - Professional availability schedules
- `guests` - Guest appointment bookings

**Professional Tables**

- `doctors` - Doctor profiles and specializations
- `nutritionists` - Nutritionist profiles and expertise
- `life_coaches` - Life coach profiles and specialties
- `coaches` - General coaches (fitness, career, etc.)

**Enhanced Features**

- `courses` - Educational courses and content
- `course_videos` - Video content for courses
- `todo_lists` - Client-professional task management
- `video_sessions` - Google Meet integration records
- `nutrition_plans` - Personalized nutrition recommendations
- `coaching_sessions` - Coaching session records

### 4. Start Development Servers

```bash
# Start Laravel backend (Terminal 1)
php artisan serve

# Start Vite frontend (Terminal 2)
npm run dev
# or
bun run dev
```

## 📁 Project Structure

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

## 🔌 API Endpoints

### Public Routes

- `GET /api/medicines` - List medicines
- `GET /api/tests` - List diagnostic tests
- `GET /api/courses` - List available courses
- `POST /api/login` - User authentication
- `POST /api/register` - User registration

### Medical Services

- `GET /api/doctors` - List doctors
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment with video link
- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription

### Wellness Services

- `GET /api/nutritionists` - List nutritionists
- `GET /api/life-coaches` - List life coaches
- `GET /api/coaches` - List specialized coaches
- `POST /api/nutrition-plans` - Create nutrition plan
- `POST /api/coaching-sessions` - Schedule coaching session

### Enhanced Features

- `GET /api/courses/{id}/videos` - Get course videos
- `GET /api/todo-lists` - Get client todo lists
- `POST /api/todo-lists` - Create todo item
- `POST /api/video-sessions` - Generate Google Meet link
- `PUT /api/todo-lists/{id}` - Update todo status

## 👥 User Types

### Healthcare Professionals

- **Doctors** - Medical consultations, prescriptions, medical records
- **Nutritionists** - Dietary plans, nutrition consultations, meal planning

### Wellness Professionals

- **Life Coaches** - Personal development, goal setting, life planning
- **Fitness Coaches** - Exercise programs, fitness consultations
- **Career Coaches** - Professional development, career guidance
- **Relationship Coaches** - Relationship counseling and advice
- **Wellness Coaches** - Holistic health and lifestyle coaching

### Clients

- **Patients** - Access to all medical and wellness services
- **Guests** - Limited booking capabilities

## 📝 Development Notes

- Medicine and test management is **read-only** for professionals
- Google Meet integration requires API credentials in `.env`
- Video courses support YouTube and Vimeo embedding
- Todo lists are collaborative between clients and professionals
- Real-time notifications for appointments and tasks
- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:5173`

## 🔐 Environment Variables

Add to your `.env` file:

```env
GOOGLE_MEET_CLIENT_ID=your_google_client_id
GOOGLE_MEET_CLIENT_SECRET=your_google_client_secret
VIDEO_STORAGE_PATH=storage/courses/videos
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

![Profile Views](https://komarev.com/ghpvc/?username=Aqib2607&color=brightgreen&style=for-the-badge)

**Made with ❤️ by [Aqib2607](https://github.com/Aqib2607)**

</div>
