<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vital;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class VitalsController extends Controller
{
    public function index(Request $request, $patientId): JsonResponse
    {
        \Log::info('VitalsController: Request received', [
            'patient_id' => $patientId,
            'user_type' => get_class($request->user()),
            'user_id' => $request->user() ? ($request->user() instanceof \App\Models\Patient ? $request->user()->patient_id : $request->user()->doctor_id) : null
        ]);
        
        $user = $request->user();
        
        // Authorization check
        if ($user instanceof \App\Models\Patient && $user->patient_id != $patientId) {
            \Log::warning('VitalsController: Unauthorized access attempt', [
                'user_patient_id' => $user->patient_id,
                'requested_patient_id' => $patientId
            ]);
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'vital_type' => 'string|in:blood_pressure_systolic,blood_pressure_diastolic,heart_rate,temperature,respiratory_rate,oxygen_saturation',
            'date_from' => 'date',
            'date_to' => 'date|after_or_equal:date_from',
            'sort_by' => 'string|in:vital_type,recorded_at',
            'sort_order' => 'string|in:asc,desc'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $query = Vital::where('patient_id', $patientId);

        // Apply filters
        if ($request->has('vital_type')) {
            $query->where('vital_type', $request->vital_type);
        }

        if ($request->has('date_from')) {
            $query->whereDate('recorded_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('recorded_at', '<=', $request->date_to);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'recorded_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $limit = $request->get('limit', 50);
        $vitals = $query->paginate($limit);
        
        \Log::info('VitalsController: Query results', [
            'total_found' => $vitals->total(),
            'current_page' => $vitals->currentPage(),
            'per_page' => $vitals->perPage()
        ]);

        // Transform data
        $transformedVitals = $vitals->getCollection()->map(function ($vital) {
            return [
                'id' => $vital->id,
                'vital_type' => $vital->vital_type,
                'value' => $vital->value,
                'unit' => $vital->unit,
                'recorded_at' => $vital->recorded_at->toISOString(),
                'recorded_by' => $vital->recorded_by,
                'notes' => $vital->notes,
                'is_abnormal' => $vital->isAbnormal()
            ];
        });

        return response()->json([
            'data' => $transformedVitals,
            'pagination' => [
                'current_page' => $vitals->currentPage(),
                'last_page' => $vitals->lastPage(),
                'per_page' => $vitals->perPage(),
                'total' => $vitals->total()
            ],
            'last_updated' => now()->toISOString()
        ]);
    }
}