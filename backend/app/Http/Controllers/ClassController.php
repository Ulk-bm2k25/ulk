<?php
namespace App\Http\Controllers;


use App\Models\NiveauScolaire;
use App\Models\Matiere;
use App\Models\Affectation;
use App\Models\Classe;
use App\Models\Eleve;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassController extends Controller
{
    public function index()
    {
        return response()->json(Classe::with(['niveauScolaire', 'eleves.user'])->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'niveau_id' => 'required|exists:niveaux_scolaires,id',
            'capacity_max' => 'integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $class = Classe::create($request->all());
        return response()->json($class, 201);
    }

    public function show($id)
    {
        $class = Classe::with('niveauScolaire', 'eleves.user', 'matieres', 'enseignants')->findOrFail($id);
        return response()->json($class);
    }

    public function update(Request $request, $id)
    {
        $class = Classe::findOrFail($id);
        $class->update($request->all());
        return response()->json($class);
    }

    public function destroy($id)
    {
        $class = Classe::findOrFail($id);
        if ($class->eleves()->count() > 0) {
            return response()->json(['error' => 'Impossible de supprimer une classe contenant des élèves.'], 400);
        }
        $class->delete();
        return response()->json(['message' => 'Classe supprimée']);
    }

    public function assignEleve(Request $request, $classId)
    {
        $class = Classe::findOrFail($classId);
        if ($class->isFull()) {
            return response()->json(['error' => 'Classe pleine'], 400);
        }

        $validator = Validator::make($request->all(), [
            'eleve_id' => 'required|exists:eleves,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $eleve = Eleve::findOrFail($request->eleve_id);
        $eleve->classe_id = $classId;
        $eleve->save();

        $class->incrementStudents();
        return response()->json(['message' => 'Élève affecté']);
    }

    public function unassignEleve($classId, $eleveId)
    {
        $eleve = Eleve::where('id', $eleveId)->where('classe_id', $classId)->firstOrFail();
        $eleve->classe_id = null;
        $eleve->save();

        $class = Classe::findOrFail($classId);
        $class->decrementStudents();
        return response()->json(['message' => 'Élève désaffecté']);
    }

    public function assignEnseignant(Request $request, $classId)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'matiere_id' => 'required|exists:matieres,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Affectation::create([
            'class_id' => $classId,
            'user_id' => $request->user_id,
            'matiere_id' => $request->matiere_id,
            'type' => 'enseignant',
        ]);

        return response()->json(['message' => 'Enseignant affecté']);
    }

    public function teachers()
    {
        $teachers = User::where('role', 'ENSEIGNANT')->get();
        return response()->json(['teachers' => $teachers]);
    }

    public function niveaux()
    {
        return response()->json(NiveauScolaire::all());
    }

    public function matieres()
    {
        return response()->json(Matiere::all());
    }
}
