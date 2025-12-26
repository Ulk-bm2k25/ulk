<?php
namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Eleve;
use App\Models\Matiere;
use App\Models\Semestre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class NoteController extends Controller
{
    /**
     * Generate and download a PDF bulletin for a specific student and semester.
     */
    public function downloadBulletin($eleveId, Request $request)
    {
        $semestreId = $request->query('semestre_id', 1);
        $eleve = Eleve::with(['user', 'classe'])->findOrFail($eleveId);
        $semestre = Semestre::findOrFail($semestreId);
        
        $notes = Note::with('matiere')
            ->where('eleve_id', $eleveId)
            ->where('semestre_id', $semestreId)
            ->get();

        if ($notes->isEmpty()) {
            return response()->json(['error' => 'Aucune note disponible pour ce semestre.'], 404);
        }

        // Calculate weighted average
        $totalPoints = 0;
        $totalCoefficients = 0;
        foreach ($notes as $note) {
            $totalPoints += $note->note * $note->coefficient;
            $totalCoefficients += $note->coefficient;
        }
        $average = $totalCoefficients > 0 ? $totalPoints / $totalCoefficients : 0;

        $data = [
            'eleve' => $eleve,
            'semestre' => $semestre,
            'notes' => $notes,
            'average' => $average,
            'total_points' => $totalPoints,
            'total_coefficients' => $totalCoefficients,
            'annee_scolaire' => date('Y') . '-' . (date('Y') + 1), // Simplified
        ];

        $pdf = Pdf::loadView('bulletin', $data);
        
        return $pdf->download("Bulletin_{$eleve->user->nom}_{$semestre->nom}.pdf");
    }
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
            'grades.*.note' => 'required|numeric|min:0|max:20',
            'grades.*.coefficient' => 'nullable|integer|min:1',
            'grades.*.appreciation' => 'nullable|string',
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
                        'note' => $gradeData['note'],
                        'coefficient' => $gradeData['coefficient'] ?? 1,
                        'appreciation' => $gradeData['appreciation'] ?? null,
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
     * Generate bulletins for a class (simplified - just calculates averages).
     */
    public function generateBulletins(Request $request, $classId)
    {        
        $students = Eleve::with('user')->where('classe_id', $classId)->get();
        $semestreId = $request->input('semestre_id', 1);
        $results = [];

        foreach ($students as $student) {
            $notes = Note::where('eleve_id', $student->id)
                ->where('semestre_id', $semestreId)
                ->get();

            if ($notes->count() > 0) {
                // Calculate weighted average
                $totalPoints = 0;
                $totalCoef = 0;
                foreach ($notes as $note) {
                    $totalPoints += $note->note * $note->coefficient;
                    $totalCoef += $note->coefficient;
                }
                $average = $totalCoef > 0 ? round($totalPoints / $totalCoef, 2) : 0;
            } else {
                $average = 0;
            }

            $results[] = [
                'eleve_id' => $student->id,
                'nom' => $student->user->nom ?? '',
                'prenom' => $student->user->prenom ?? '',
                'moyenne' => $average,
                'notes_count' => $notes->count()
            ];
        }

        return response()->json([
            'message' => 'Moyennes calculées avec succès',
            'results' => $results
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
