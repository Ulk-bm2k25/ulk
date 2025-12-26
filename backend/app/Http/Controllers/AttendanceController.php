<?php
namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Eleve;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * Record bulk attendance for a class.
     */
    public function storeBulk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'classe_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.eleve_id' => 'required|exists:eleves,id',
            'attendance.*.present' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            foreach ($request->attendance as $att) {
                Attendance::updateOrCreate(
                    [
                        'classe_id' => $request->classe_id,
                        'eleve_id' => $att['eleve_id'],
                        'date' => $request->date,
                        'heure' => $request->input('heure', '08:00'),
                    ],
                    [
                        'present' => $att['present'],
                    ]
                );
            }

            DB::commit();
            return response()->json(['message' => 'Présences enregistrées avec succès']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de l\'enregistrement des présences'], 500);
        }
    }

    /**
     * Get attendance history for a student (Parent Portal).
     */
    public function getStudentAttendance($eleveId)
    {
        $attendance = Attendance::where('eleve_id', $eleveId)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($attendance);
    }

    /**
     * Get attendance for a class on a specific date.
     */
    public function getClassAttendance(Request $request, $classId)
    {
        $date = $request->query('date', now()->toDateString());
        
        $attendance = Attendance::where('classe_id', $classId)
            ->where('date', $date)
            ->get();

        return response()->json($attendance);
    }
}
