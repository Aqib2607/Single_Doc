<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicalRecordActionsController extends Controller
{
    public function delete(Request $request, $recordId): JsonResponse
    {
        try {
            $user = $request->user();
            
            $record = MedicalRecord::find($recordId);
            if (!$record) {
                return response()->json(['error' => 'Record not found'], 404);
            }

            // Authorization check
            if ($user instanceof \App\Models\Patient && $user->patient_id != $record->patient_id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $record->delete();

            return response()->json([
                'message' => 'Record deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete record'], 500);
        }
    }
}