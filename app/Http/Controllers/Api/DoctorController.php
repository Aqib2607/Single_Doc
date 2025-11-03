<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $query = Doctor::query();
        
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('specialization', 'LIKE', "%{$search}%");
            });
        }
        
        $doctors = $query->select('doctor_id', 'name', 'specialization', 'consultation_fee')
                        ->orderBy('name')
                        ->get();
        
        return response()->json($doctors);
    }

    public function show(Doctor $doctor)
    {
        return response()->json($doctor->only(['doctor_id', 'name', 'specialization', 'consultation_fee']));
    }
}