<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    /**
     * Récupérer tous les cours avec leurs classes, professeurs et permissions associées
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $courses = Course::with(['classe', 'teacher', 'permissions'])->get();

        return response()->json($courses, 200);
    }

    /**
     * Récupérer un cours spécifique par ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $course = Course::with(['classe', 'teacher', 'permissions'])->findOrFail($id);

        return response()->json($course, 200);
    }

    /**
     * Créer un nouveau cours
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'subject'    => 'required|string',          // Nom ou matière du cours
            'classe_id'  => 'required|exists:classes,id',
            'teacher_id' => 'required|exists:users,id',
        ]);

        $course = Course::create($data);

        return response()->json($course, 201);
    }

    /**
     * Mettre à jour un cours existant
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $data = $request->validate([
            'subject'    => 'sometimes|string',
            'classe_id'  => 'sometimes|exists:classes,id',
            'teacher_id' => 'sometimes|exists:users,id',
        ]);

        $course->update($data);

        return response()->json($course, 200);
    }

    /**
     * Supprimer un cours
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Cours supprimé avec succès'], 200);
    }
}
