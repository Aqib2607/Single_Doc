<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\DoctorReviewController;
use App\Http\Controllers\Api\DoctorDashboardController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PrescriptionController as ApiPrescriptionController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GalleryController;

use App\Http\Controllers\Api\MedicalRecordActionsController;
use App\Http\Controllers\Api\TestController as ApiTestController;
use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\BookingController;

Route::get('/test', [ApiTestController::class, 'test']);
Route::get('/debug-appointment', [\App\Http\Controllers\Api\DebugController::class, 'testAppointmentBooking'])->middleware('auth:sanctum');
Route::get('/debug-appointment-public', [\App\Http\Controllers\Api\DebugController::class, 'testAppointmentBooking']);
Route::get('/debug-user', function(\Illuminate\Http\Request $request) {
    $user = $request->user();
    return response()->json([
        'authenticated' => $user ? true : false,
        'user_type' => $user ? get_class($user) : null,
        'user_data' => $user ? $user->toArray() : null,
        'has_patient_id' => $user && isset($user->patient_id) ? true : false,
        'patient_id_value' => $user->patient_id ?? null,
        'gender_value' => $user->gender ?? 'NULL',
        'gender_type' => $user ? gettype($user->gender) : 'N/A'
    ]);
})->middleware('auth:sanctum');

Route::post('/debug-register', function(\Illuminate\Http\Request $request) {
    return response()->json([
        'received_data' => $request->all(),
        'role' => $request->input('role'),
        'gender' => $request->input('gender'),
        'password_confirmation' => $request->input('password_confirmation')
    ]);
});



// Unified booking route (handles both guest and patient)
Route::post('/book-appointment', [BookingController::class, 'book']);

// Guest routes (no authentication required)
Route::post('/guests', [GuestController::class, 'store']);
Route::get('/guests/{id}', [GuestController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/subscriptions', [SubscriptionController::class, 'store']);

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
Route::get('/doctors/{doctor}/schedules', [DoctorController::class, 'getSchedules']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{blog}', [BlogController::class, 'show']);
Route::get('/galleries', [GalleryController::class, 'index']);
// Public routes without authentication
Route::group(['middleware' => ['throttle:api']], function () {
    Route::get('/medicines', [MedicineController::class, 'index']);
    Route::get('/medicines/categories', [MedicineController::class, 'categories']);
    Route::get('/tests', [TestController::class, 'index']);
    Route::get('/tests/categories', [TestController::class, 'categories']);

});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        if ($user instanceof \App\Models\Doctor) {
            return response()->json(array_merge($user->toArray(), ['role' => 'doctor', 'id' => $user->doctor_id]));
        } elseif ($user instanceof \App\Models\Patient) {
            return response()->json(array_merge($user->toArray(), ['role' => 'patient', 'id' => $user->patient_id]));
        }
        return $user;
    });
    
    // Medicine CRUD routes
    Route::post('/medicines', [MedicineController::class, 'store']);
    Route::get('/medicines/{medicine}', [MedicineController::class, 'show']);
    Route::put('/medicines/{medicine}', [MedicineController::class, 'update']);
    Route::delete('/medicines/{medicine}', [MedicineController::class, 'destroy']);
    
    // Test CRUD routes
    Route::post('/tests', [TestController::class, 'store']);
    Route::get('/tests/{test}', [TestController::class, 'show']);
    Route::put('/tests/{test}', [TestController::class, 'update']);
    Route::delete('/tests/{test}', [TestController::class, 'destroy']);
    Route::get('/patient/profile', [PatientController::class, 'profile']);
    Route::get('/patient/prescriptions', [ApiPrescriptionController::class, 'getPatientPrescriptions']);
    Route::get('/patient-prescriptions', [ApiPrescriptionController::class, 'getPatientPrescriptions']); // Backward compatibility
    
    // Doctor profile routes
    Route::get('/doctor/profile', [\App\Http\Controllers\Api\DoctorProfileController::class, 'show']);
    Route::put('/doctor/profile', [\App\Http\Controllers\Api\DoctorProfileController::class, 'update']);
    Route::delete('/doctor/profile', [\App\Http\Controllers\Api\DoctorProfileController::class, 'destroy']);
    
    // Patient profile routes
    Route::get('/patient/profile', [\App\Http\Controllers\Api\PatientProfileController::class, 'show']);
    Route::put('/patient/profile', [\App\Http\Controllers\Api\PatientProfileController::class, 'update']);
    Route::delete('/patient/profile', [\App\Http\Controllers\Api\PatientProfileController::class, 'destroy']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/doctor-dashboard', [DoctorDashboardController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/patient-appointments', [AppointmentController::class, 'getPatientAppointments']);
    Route::get('/doctor/appointments', [AppointmentController::class, 'getDoctorAppointments']);
    Route::get('/doctor/today-appointments', [AppointmentController::class, 'getTodayAppointments']);
    Route::put('/doctor/appointments/{id}', [AppointmentController::class, 'updateDoctorAppointment']);
    Route::delete('/doctor/appointments/{id}', [AppointmentController::class, 'deleteDoctorAppointment']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
    Route::get('/patient-medical-records', [MedicalRecordController::class, 'getPatientMedicalRecords']);
    Route::get('/doctor-schedules', [MedicalRecordController::class, 'getDoctorSchedules']);
    Route::post('/doctor-schedules', [MedicalRecordController::class, 'storeSchedule']);
    Route::put('/doctor-schedules/{id}', [MedicalRecordController::class, 'updateSchedule']);
    Route::delete('/doctor-schedules/{id}', [MedicalRecordController::class, 'deleteSchedule']);
    Route::apiResource('patients', \App\Http\Controllers\PatientController::class);
    Route::get('/patients-and-guests', [\App\Http\Controllers\PatientController::class, 'getPatientsAndGuests']);
    Route::apiResource('consultations', \App\Http\Controllers\ConsultationController::class);
    Route::resource('consultations', ConsultationController::class);
    Route::resource('medical-records', MedicalRecordController::class);
    Route::get('/medical-records/{medicalRecord}/download', [MedicalRecordController::class, 'downloadFile']);
    Route::resource('prescriptions', PrescriptionController::class);
    Route::post('/prescriptions/bulk-update', [PrescriptionController::class, 'bulkUpdate']);
    Route::resource('messages', MessageController::class);

    Route::resource('doctor-reviews', DoctorReviewController::class);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{blog}', [BlogController::class, 'update']);
    Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);
    Route::get('/doctor-blogs', [BlogController::class, 'doctorBlogs']);
    Route::get('/doctor-galleries', [GalleryController::class, 'doctorGalleries']);
    Route::post('/galleries', [GalleryController::class, 'store']);
    Route::get('/galleries/{gallery}', [GalleryController::class, 'show']);
    Route::put('/galleries/{gallery}', [GalleryController::class, 'update']);
    Route::delete('/galleries/{gallery}', [GalleryController::class, 'destroy']);

    Route::delete('/medical-records/{recordId}', [MedicalRecordActionsController::class, 'delete']);
    
    // Admin-only guest routes
    Route::get('/guests', [GuestController::class, 'index']);
});