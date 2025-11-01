# Doctor Appointments Endpoint

## Overview

This endpoint allows authenticated doctors to retrieve all appointments assigned to them, providing comprehensive appointment data including patient information, scheduling details, and medical notes.

## Endpoint Details

**URL:** `http://127.0.0.1:8000/api/doctor/appointments`  
**Method:** `GET`  
**Authentication:** Required (Bearer token)  
**Content-Type:** `application/json`

## Implementation

### Database Changes

- **Migration:** `2025_01_18_000002_add_doctor_id_to_appointments_table.php`
- **Added Fields:**
  - `doctor_id` (foreign key to doctors table)
  - `medical_notes` (text field for medical observations)
- **Indexes:** Added index on `doctor_id` for query optimization

### Model Updates

- **File:** `app/Models/Appointment.php`
- **Added Relationships:**
  - `doctor()` - belongsTo Doctor model
  - `patient()` - belongsTo Patient model
- **Added Fields:** `doctor_id`, `medical_notes` to fillable array

### Controller Method

- **File:** `app/Http/Controllers/Api/AppointmentController.php`
- **Method:** `getDoctorAppointments(Request $request)`
- **Features:**
  - Doctor authentication verification
  - Filters appointments by authenticated doctor's ID
  - Includes patient relationship data
  - Structured JSON response format
  - Proper error handling and HTTP status codes

### Route

- **File:** `routes/api.php`
- **Route:** `Route::get('/doctor/appointments', [AppointmentController::class, 'getDoctorAppointments']);`
- **Middleware:** `auth:sanctum` (requires authentication)

## Authentication

The endpoint requires a valid Bearer token for a doctor account:

```bash
Authorization: Bearer {doctor_token}
```

To obtain a token, doctors must first login via:

```bash
POST /api/login
{
    "email": "doctor@example.com",
    "password": "password"
}
```

## Request Example

```bash
curl -X GET "http://127.0.0.1:8000/api/doctor/appointments" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "appointment_id": 1,
      "patient_info": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "gender": "male"
      },
      "date_time": {
        "date": "2025-01-20",
        "time": "10:00",
        "formatted": "Jan 20, 2025 at 10:00 AM"
      },
      "status": "confirmed",
      "consultation_type": "in-person",
      "reason": "Regular checkup",
      "medical_notes": "Patient appears healthy, no concerns"
    }
  ],
  "total": 1
}
```

### No Appointments Found (404 Not Found)

```json
{
  "success": false,
  "message": "No appointments found for this doctor."
}
```

### Authentication Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized. Doctor authentication required."
}
```

### Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Unable to fetch appointments. Please try again later."
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `appointment_id` | integer | Unique appointment identifier |
| `patient_info.name` | string | Patient's full name |
| `patient_info.email` | string | Patient's email address |
| `patient_info.phone` | string | Patient's phone number |
| `patient_info.gender` | string | Patient's gender |
| `date_time.date` | string | Appointment date (Y-m-d format) |
| `date_time.time` | string | Appointment time (H:i format) |
| `date_time.formatted` | string | Human-readable date and time |
| `status` | string | Appointment status (pending, confirmed, cancelled) |
| `consultation_type` | string | Type of consultation |
| `reason` | string | Reason for appointment |
| `medical_notes` | string | Doctor's medical notes |

## Security Features

- **Authentication Required:** Only authenticated doctors can access
- **Authorization Check:** Doctors can only see their own appointments
- **Data Filtering:** Automatic filtering by doctor_id prevents data leakage
- **Input Validation:** Proper request validation and sanitization
- **Error Handling:** Secure error messages without sensitive data exposure

## Query Optimization

- **Database Index:** Added index on `doctor_id` for fast filtering
- **Eager Loading:** Uses `with(['patient'])` to prevent N+1 queries
- **Ordered Results:** Sorted by date and time (most recent first)

## Testing

### Unit Tests

- **File:** `tests/Feature/DoctorAppointmentsTest.php`
- **Coverage:**
  - Authenticated doctor can view appointments
  - Doctor only sees their own appointments
  - Unauthenticated access is blocked
  - Proper 404 response when no appointments exist

### Test Scripts

- **Database Test:** `test_doctor_appointments.php`
- **API Test:** `test_doctor_appointments_api.php`

## Usage Examples

### JavaScript/Fetch

```javascript
const response = await fetch('http://127.0.0.1:8000/api/doctor/appointments', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});
const data = await response.json();
```

### PHP/cURL

```php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8000/api/doctor/appointments');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
```

## Error Handling

The endpoint implements comprehensive error handling:

1. **Authentication Errors:** Returns 401 with clear message
2. **No Data Found:** Returns 404 with appropriate message
3. **Database Errors:** Returns 500 with generic error message
4. **Logging:** All errors are logged for debugging

## Performance Considerations

- **Indexed Queries:** Fast retrieval using doctor_id index
- **Eager Loading:** Prevents N+1 query problems
- **Pagination:** Consider adding pagination for doctors with many appointments
- **Caching:** Consider implementing caching for frequently accessed data

The endpoint is fully functional and ready for production use!
