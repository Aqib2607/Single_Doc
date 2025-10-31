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
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GalleryController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::post('/subscriptions', [SubscriptionController::class, 'store']);
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);
Route::delete('/cart/{id}', [CartController::class, 'destroy']);
Route::get('/blogs', [BlogController::class, 'index']);

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
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/doctor-dashboard', [DoctorDashboardController::class, 'index']);
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/patient-appointments', [AppointmentController::class, 'getPatientAppointments']);
    Route::get('/patient-prescriptions', [PrescriptionController::class, 'getPatientPrescriptions']);
    Route::get('/patient-medical-records', [MedicalRecordController::class, 'getPatientMedicalRecords']);
    Route::get('/doctor-schedules', [MedicalRecordController::class, 'getDoctorSchedules']);
    Route::post('/doctor-schedules', [MedicalRecordController::class, 'storeSchedule']);
    Route::apiResource('patients', \App\Http\Controllers\PatientController::class);
    Route::apiResource('consultations', \App\Http\Controllers\ConsultationController::class);
    Route::resource('consultations', ConsultationController::class);
    Route::resource('medical-records', MedicalRecordController::class);
    Route::resource('prescriptions', PrescriptionController::class);
    Route::resource('messages', MessageController::class);
    Route::resource('medicines', MedicineController::class);
    Route::resource('tests', TestController::class);
    Route::resource('doctor-reviews', DoctorReviewController::class);
    Route::apiResource('blogs', BlogController::class);
    Route::get('/doctor-blogs', [BlogController::class, 'doctorBlogs']);
    Route::apiResource('galleries', GalleryController::class);
});