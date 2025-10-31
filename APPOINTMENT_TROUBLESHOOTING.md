# Appointment Booking Troubleshooting Guide

## Overview

This guide helps diagnose and resolve appointment booking failures with comprehensive error handling and logging.

## Quick Diagnosis Steps

### 1. Check System Status

```bash
# Run the test script
php test_appointment_booking.php

# Check if doctors exist
php artisan tinker
>>> App\Models\Doctor::count()
>>> App\Models\Doctor::all(['doctor_id', 'name', 'specialization'])
```

### 2. Check Laravel Logs

```bash
# View recent logs
tail -f storage/logs/laravel.log

# Clear logs for fresh debugging
> storage/logs/laravel.log
```

### 3. Test API Endpoint Directly

```bash
# Test doctors endpoint
curl -X GET http://localhost:8000/api/doctors

# Test appointment creation
curl -X POST http://localhost:8000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "test@example.com",
    "phone": "+1-555-0123",
    "date": "2024-12-25",
    "time": "10:00",
    "doctor_id": 1,
    "termsAccepted": true
  }'
```

## Common Issues and Solutions

### Issue 1: "Failed to book appointment" Error

**Symptoms:**

- Generic error message displayed
- No specific error details

**Diagnosis:**

1. Check browser console for network errors
2. Check Laravel logs for detailed error messages
3. Verify database connection

**Solutions:**

```bash
# Check database connection
php artisan migrate:status

# Clear application cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Issue 2: Doctor Dropdown Not Loading

**Symptoms:**

- Dropdown shows "Loading doctors..." indefinitely
- "Failed to fetch doctors" error

**Diagnosis:**

```bash
# Test doctors API endpoint
curl http://localhost:8000/api/doctors

# Check if doctors exist in database
php artisan tinker
>>> App\Models\Doctor::count()
```

**Solutions:**

```bash
# Seed doctors if none exist
php artisan db:seed --class=ComprehensiveSeeder

# Check API routes
php artisan route:list | grep doctors
```

### Issue 3: Validation Errors

**Symptoms:**

- Form shows validation error messages
- Red borders on form fields

**Common Validation Issues:**

- **Date in past**: Appointment date must be in the future
- **Missing doctor**: Doctor selection is required
- **Invalid email**: Email format validation
- **Terms not accepted**: Terms checkbox must be checked

**Solutions:**

- Ensure all required fields are filled
- Select a valid future date
- Choose a doctor from the dropdown
- Accept terms and conditions

### Issue 4: Network/CORS Errors

**Symptoms:**

- "Network error" in browser console
- CORS policy errors

**Solutions:**

```bash
# Check if Laravel server is running
php artisan serve

# Verify API endpoints are accessible
curl -I http://localhost:8000/api/doctors
```

### Issue 5: Database Connection Issues

**Symptoms:**

- "Database connection failed" in test script
- SQL connection errors in logs

**Solutions:**

```bash
# Check database configuration
cat .env | grep DB_

# Test database connection
php artisan migrate:status

# Reset database if needed
php artisan migrate:fresh --seed
```

## Error Response Format

The system now returns structured error responses:

### Success Response

```json
{
  "success": true,
  "message": "Appointment booked successfully!",
  "appointment": { ... }
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Please check your input and try again.",
  "errors": {
    "name": ["Name is required"],
    "doctor_id": ["Please select a doctor"]
  }
}
```

### Server Error Response

```json
{
  "success": false,
  "message": "Unable to book appointment at this time.",
  "error": "Detailed error message (in debug mode)"
}
```

## Debugging Features

### 1. Enhanced Logging

- All API requests and responses are logged
- Detailed error information with stack traces
- Request validation logging

### 2. Client-Side Validation

- Real-time form validation
- Field-specific error messages
- Loading states and user feedback

### 3. Server-Side Validation

- Comprehensive input validation
- Doctor existence verification
- Duplicate appointment detection

## Testing Scenarios

### Valid Booking Test

```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "gender": "male",
  "date": "2024-12-25",
  "time": "10:00",
  "doctor_id": 1,
  "consultationType": "in-person",
  "reason": "Regular checkup",
  "termsAccepted": true
}
```

### Invalid Booking Tests

1. **Missing required fields**
2. **Invalid doctor ID**
3. **Past date selection**
4. **Duplicate appointment**
5. **Invalid email format**

## Monitoring and Maintenance

### Daily Checks

```bash
# Check system health
php test_appointment_booking.php

# Monitor error logs
tail -n 100 storage/logs/laravel.log | grep ERROR
```

### Weekly Maintenance

```bash
# Clear old logs
> storage/logs/laravel.log

# Update doctor availability
php artisan tinker
>>> App\Models\Doctor::where('active', true)->count()
```

## Support Information

### Log Locations

- Laravel logs: `storage/logs/laravel.log`
- Web server logs: Check your web server configuration
- Database logs: Check your database server logs

### Key Files for Debugging

- `app/Http/Controllers/Api/AppointmentController.php`
- `src/pages/AppointmentPage.tsx`
- `src/components/ui/DoctorSelect.tsx`
- `routes/api.php`

### Contact Information

If issues persist after following this guide:

1. Check the Laravel logs for specific error messages
2. Run the test script to verify system components
3. Ensure all dependencies are properly installed
4. Verify database seeding has been completed

## Quick Fix Commands

```bash
# Complete system reset
php artisan migrate:fresh --seed
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Test system
php test_appointment_booking.php

# Start development server
php artisan serve
```
