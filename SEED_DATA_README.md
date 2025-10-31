# Database Seed Data Documentation

## Overview

This comprehensive seed data file populates all database tables with realistic, interconnected data for testing and development purposes.

## Tables Populated

- **doctors** (5 records) - Medical professionals with different specializations
- **patients** (5 records) - Patient profiles with medical histories
- **appointments** (5 records) - Scheduled appointments with various statuses
- **cart_items** (5 records) - Medical supplies and equipment in shopping carts
- **consultations** (5 records) - Doctor-patient consultation records
- **medical_records** (5 records) - Patient medical documents and test results
- **prescriptions** (5 records) - Medication prescriptions with dosage information
- **messages** (5 records) - Communication between doctors and patients
- **medicines** (5 records) - Available medications in the system
- **tests** (5 records) - Medical tests and procedures
- **doctor_reviews** (5 records) - Patient reviews and ratings for doctors
- **blogs** (5 records) - Medical blog posts by doctors
- **galleries** (5 records) - Medical images and videos
- **subscriptions** (5 records) - Newsletter subscriptions
- **schedules** (5 records) - Doctor availability schedules

## Usage Instructions

### Method 1: Laravel Artisan Command

```bash
# Run all seeders (recommended)
php artisan db:seed

# Run only the comprehensive seeder
php artisan db:seed --class=ComprehensiveSeeder
```

### Method 2: Standalone PHP Script

```bash
# Make sure your .env file is configured with database credentials
php run_seeder.php
```

## Data Characteristics

### Referential Integrity

- All foreign key relationships are properly maintained
- Doctor IDs (1-5) are referenced in consultations, prescriptions, etc.
- Patient IDs (1-5) are referenced across related tables
- Email addresses are consistent across related records

### Realistic Data Examples

- **Doctors**: Various specializations (Cardiology, Pediatrics, Dermatology, Orthopedics, Neurology)
- **Patients**: Different age groups, genders, and medical conditions
- **Appointments**: Mix of statuses (pending, confirmed, cancelled)
- **Prescriptions**: Real medication names with proper dosages and instructions
- **Medical Records**: Various record types (Lab Results, Imaging, etc.)

### Test Scenarios Covered

- **Active vs Inactive Records**: Some medicines and tests are marked as inactive
- **Read vs Unread Messages**: Mix of read and unread communication
- **Approved vs Pending Reviews**: Different approval statuses for doctor reviews
- **Published vs Draft Blogs**: Content in various publication states
- **Available vs Unavailable Schedules**: Doctor availability variations

## Sample Data Details

### Doctor Specializations

1. Dr. Sarah Johnson - Cardiology ($250 consultation fee)
2. Dr. Michael Chen - Pediatrics ($180 consultation fee)
3. Dr. Emily Rodriguez - Dermatology ($200 consultation fee)
4. Dr. James Wilson - Orthopedics ($300 consultation fee)
5. Dr. Lisa Thompson - Neurology ($275 consultation fee)

### Patient Demographics

- Age range: 13-59 years old
- Various medical conditions: Hypertension, Diabetes, Asthma, Arthritis
- Different allergy profiles and emergency contacts

### Appointment Types

- In-person consultations
- Telemedicine appointments
- Follow-up visits
- General consultations

## Database Requirements

- MySQL 5.7+ or MariaDB 10.2+
- All migration files must be run before seeding
- Foreign key constraints enabled

## Verification

The seeder automatically outputs a summary report showing:

- Number of records created per table
- Total tables seeded
- Total records created
- Success confirmation

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**: Ensure all migrations are run first
2. **Duplicate Entry Errors**: The seeder clears existing data before inserting
3. **Database Connection Errors**: Check your .env file configuration

### Error Resolution

- The seeder includes proper error handling and rollback mechanisms
- Foreign key checks are temporarily disabled during data clearing
- All timestamps are properly set using Laravel's `now()` helper

## Customization

To modify the seed data:

1. Edit the arrays in each `seed*()` method in `ComprehensiveSeeder.php`
2. Maintain referential integrity when changing IDs
3. Update the record counts in the summary report if needed

## Security Notes

- All passwords are hashed using Laravel's Hash facade
- No real personal information is used
- Email addresses use example domains
- Phone numbers use reserved ranges for testing
