<?php
namespace App\Models;

use App\Models\Note;
use App\Models\Eleve;
use App\Models\Matiere;
use App\Models\Semestre;
use App\Models\Bulletin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    /**
     * Get all grades for a specific class and subject/semester.
     */
    public function getGradesByClass(Request $request, $classId)
    {
        $matiereId = $request->query('matiere_id');
        $semestreId = $request->query('semestre_id');

        $query = Note::with('eleve.user')
            ->whereHas('eleve', function ($q) use ($classId) {
                $q->where('classe_id', $classId);
            });

        if ($matiereId) {
            $query->where('matiere_id', $matiereId);
        }
        if ($semestreId) {
            $query->where('semestre_id', $semestreId);
        }

        return response()->json($query->get());
    }

    /**
     * Store or update multiple grades at once (bulk entry).
     */
    public function storeBulk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'grades' => 'required|array',
            'grades.*.eleve_id' => 'required|exists:eleves,id',
            'grades.*.matiere_id' => 'required|exists:matieres,id',
            'grades.*.semestre_id' => 'required|exists:semestres,id',
            'grades.*.valeur' => 'required|numeric|min:0|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            foreach ($request->grades as $gradeData) {
                Note::updateOrCreate(
                    [
                        'eleve_id' => $gradeData['eleve_id'],
                        'matiere_id' => $gradeData['matiere_id'],
                        'semestre_id' => $gradeData['semestre_id'],
                    ],
                    [
                        'valeur' => $gradeData['valeur'],
                        'date_note' => now(),
                    ]
                );
            }

            DB::commit();
            return response()->json(['message' => 'Notes enregistrées avec succès']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de l\'enregistrement des notes'], 500);
        }
    }

    /**
     * Get grades for a specific student (for parent portal).
     */
    public function getStudentGrades($eleveId)
    {
        $grades = Note::with(['matiere', 'semestre'])
            ->where('eleve_id', $eleveId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($grades);
    }

    /**
     * Generate bulletins for a class.
     */
    public function generateBulletins(Request $request, $classId)
    {
        $anneeScolaire = $request->input('annee_scolaire', '2024-2025');
        
        $students = Eleve::where('classe_id', $classId)->get();
        $bulletins = [];

        foreach ($students as $student) {
            $average = Note::where('eleve_id', $student->id)
                ->whereHas('semestre', function($q) use ($request) {
                    if ($request->has('semestre_id')) {
                        $q->where('id', $request->semestre_id);
                    }
                })
                ->avg('valeur');

            $bulletin = Bulletin::updateOrCreate(
                [
                    'eleve_id' => $student->id,
                    'annee_scolaire' => $anneeScolaire,
                ],
                [
                    'moyenne' => $average,
                ]
            );
            $bulletins[] = $bulletin;
        }

        return response()->json([
            'message' => 'Bulletins générés avec succès',
            'bulletins' => $bulletins
        ]);
    }

    public function getMatieres()
    {
        return response()->json(Matiere::all());
    }

    public function getSemestres()
    {
        return response()->json(Semestre::all());
    }
}
