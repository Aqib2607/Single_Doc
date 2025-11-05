# Deployment Guide for Single_Doc (Laravel & React)

This guide outlines the steps to deploy your full-stack Laravel and React application, where both the frontend and backend reside within the same project directory.

## Project Structure Overview

Your project, `Single_Doc`, contains:

- **Laravel Backend:** Located in the root directory, handling API routes, database, and business logic.
- **React Frontend:** Located in the `src/` directory, built using Vite.

## Deployment Strategy

The core idea is to build the React frontend into Laravel's `public` directory. This allows Laravel to serve the static frontend assets directly, while also handling API requests.

## Prerequisites

Before you begin, ensure you have:

- A server with PHP (8.1+ recommended), Composer, Node.js (LTS recommended), and npm/bun installed.
- A web server (Nginx or Apache) configured to serve PHP applications.
- A database (e.g., MySQL, PostgreSQL) and its connection details.
- Your project code pushed to a GitHub repository.

## Deployment Steps

### 1. Server Setup

If you are using a Virtual Private Server (VPS) or a Virtual Machine (VM):

1. **Install Dependencies:** Install PHP, Composer, Node.js, npm/bun, and your chosen database server.
2. **Web Server Configuration:** Install and configure Nginx or Apache. Ensure it's set up to serve PHP applications and points to the `public` directory of your Laravel project.

    *Example Nginx configuration snippet (adjust as needed):*

    ```nginx
    server {
        listen 80;
        server_name your_domain.com;
        root /var/www/html/Single_Doc/public;

        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";

        index index.php index.html index.htm;

        charset utf-8;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; # Adjust PHP version
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            include fastcgi_params;
        }

        location ~ /\\.env {
            deny all;
        }

        location ~ /storage {
            # Allow access to storage files
            try_files $uri $uri/ /index.php?$query_string;
        }
    }
    ```

### 2. Get Your Code

1. **Clone the Repository:** On your server, navigate to your desired deployment directory (e.g., `/var/www/html/`) and clone your GitHub repository:

    ```bash
    git clone https://github.com/your-username/Single_Doc.git
    cd Single_Doc
    ```

### 3. Backend Setup (Laravel)

1. **Install Composer Dependencies:**

    ```bash
    composer install --no-dev --optimize-autoloader
    ```

2. **Environment Configuration:**
    - Copy the example environment file:

        ```bash
        cp .env.example .env
        ```

    - Edit the `.env` file and update the database credentials, `APP_URL`, `APP_ENV=production`, and any other production-specific settings.
    - Generate an application key:

        ```bash
        php artisan key:generate
        ```

3. **Database Migrations:**
    - Run database migrations to create your tables:

        ```bash
        php artisan migrate --force
        ```

    - If you have seeders for initial data (use with caution in production):

        ```bash
        php artisan db:seed
        ```

4. **Storage Link:** Create a symbolic link for storage:

    ```bash
    php artisan storage:link
    ```

5. **Optimize Laravel:**

    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

### 4. Frontend Setup (React.js)

1. **Install Node.js Dependencies:**

    ```bash
    npm install
    # OR if you prefer bun
    bun install
    ```

2. **Build the Frontend:** This step will compile your React application and place the optimized static assets into Laravel's `public/build` directory (as configured by `vite.config.js`).

    ```bash
    npm run build
    # OR if you prefer bun
    bun run build
    ```

    - **Important:** Ensure your `vite.config.js` is correctly configured to output to Laravel's public directory. Your current `vite.config.js` already uses `laravel-vite-plugin`, which handles this correctly by default, outputting to `public/build`.

3. **Environment Variables for Frontend:** If your React app needs to know the API URL, ensure it's correctly configured in your `.env` file (e.g., `VITE_API_URL=https://your_domain.com/api`). Vite will pick this up during the build process.

### 5. Final Steps & Security

1. **File Permissions:** Ensure appropriate file permissions for the `storage` and `bootstrap/cache` directories (e.g., `chmod -R 775 storage bootstrap/cache`).
2. **HTTPS:** Configure SSL/TLS for your domain to enable HTTPS. This is crucial for security.
3. **Queue Workers/Scheduled Tasks:** If your application uses Laravel Queues or Scheduled Tasks, set up a process manager (like Supervisor) to keep them running.
4. **Monitoring:** Implement monitoring for your server and application to catch issues early.

## Continuous Deployment (Optional but Recommended)

Consider setting up a CI/CD pipeline (e.g., GitHub Actions, GitLab CI, Jenkins) to automate these steps. This would typically involve:

1. Pushing code to your GitHub repository.
2. The CI/CD pipeline automatically pulling the latest code on your server.
3. Running `composer install`, `npm install`, `npm run build`, `php artisan migrate`, and other necessary commands.
4. Restarting your web server or PHP-FPM process.

This combined approach allows you to deploy both parts of your application efficiently to a single server environment. Good luck!
