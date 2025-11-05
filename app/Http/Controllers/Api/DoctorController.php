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

    public function getSchedules($doctorId)
    {
        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        $schedules = \App\Models\Schedule::where('doctor_id', $doctorId)
            ->where('is_available', true)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->map(function ($schedule) {
                return [
                    'day_of_week' => $schedule->day_of_week,
                    'start_time' => $schedule->start_time,
                    'end_time' => $schedule->end_time,
                    'time_slots' => $this->generateTimeSlots($schedule->start_time, $schedule->end_time)
                ];
            });

        return response()->json($schedules);
    }

    private function generateTimeSlots($startTime, $endTime)
    {
        $slots = [];
        $start = \Carbon\Carbon::createFromFormat('H:i:s', $startTime);
        $end = \Carbon\Carbon::createFromFormat('H:i:s', $endTime);
        
        while ($start < $end) {
            $slots[] = [
                'value' => $start->format('H:i'),
                'label' => $start->format('g:i A')
            ];
            $start->addMinutes(30); // 30-minute slots
        }
        
        return $slots;
    }
}