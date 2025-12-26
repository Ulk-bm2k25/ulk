<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParentTuteur;
use App\Models\Eleve;
use App\Models\Inscription;
use App\Models\User;
use App\Models\AnneeScolaire;
use App\Models\Classe;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class ParentPortalController extends Controller
{
    /**
     * Get the dashboard summary for the parent.
     */
    public function getDashboardSummary(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'PARENT') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $parent = ParentTuteur::where('user_id', $user->id)->first();
        if (!$parent) {
            return response()->json(['message' => 'Profil parent non trouvé'], 404);
        }

        $childrenCount = $parent->eleves()->count();
        
        $notificationsCount = DB::table('notifications')
            ->where('destinataire_id', $user->id)
            ->where('lu', false)
            ->count();

        return response()->json([
            'summary' => [
                'children_count' => $childrenCount,
                'notifications' => $notificationsCount,
            ]
        ]);
    }

    /**
     * Get the list of children for the authenticated parent.
     */
    public function getChildren(Request $request)
    {
        $user = Auth::user();
        $parent = ParentTuteur::where('user_id', $user->id)->first();
        
        if (!$parent) {
            return response()->json(['children' => []], 200);
        }

        $children = $parent->eleves()->with(['user', 'classe.niveauScolaire', 'inscriptions.anneeScolaire'])->get();

        return response()->json(['children' => $children]);
    }

    /**
     * Get the notifications for the parent.
     */
    public function getNotifications(Request $request)
    {
        $user = Auth::user();
        $notifications = DB::table('notifications')
            ->where('destinataire_id', $user->id)
            ->orderBy('lu', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markNotificationAsRead($id)
    {
        $user = Auth::user();
        DB::table('notifications')
            ->where('id', $id)
            ->where('destinataire_id', $user->id)
            ->update(['lu' => true, 'updated_at' => now()]);

        return response()->json(['message' => 'Notification marquée comme lue.']);
    }

    /**
     * Mark all notifications as read for the user.
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        DB::table('notifications')
            ->where('destinataire_id', $user->id)
            ->where('lu', false)
            ->update(['lu' => true, 'updated_at' => now()]);

        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues.']);
    }


    /**
     * Get specific child details including registrations and grades.
     */
    public function getChildDetails($eleveId)
    {
        $user = Auth::user();
        $parent = ParentTuteur::where('user_id', $user->id)->first();

        // Vérifier que c'est bien l'enfant du parent
        $isChild = $parent->eleves()->where('eleves.id', $eleveId)->exists();
        if (!$isChild) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $eleve = Eleve::with(['user', 'classe', 'inscriptions.anneeScolaire'])->findOrFail($eleveId);
        
        return response()->json($eleve);
    }
    /**
     * Enroll a new child.
     */
    public function enrollChild(Request $request)
    {
        $request->validate([
            'parentName' => 'required|string',
            'parentPhone' => 'required|string',
            'parentProfession' => 'nullable|string',
            'parentAddress' => 'nullable|string',
            'childName' => 'required|string',
            'childBirthDate' => 'required|date',
            'childGender' => 'required|string',
            'childGrade' => 'required|string',
        ]);

        $user = Auth::user();
        if ($user->role !== 'PARENT') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $parent = ParentTuteur::where('user_id', $user->id)->first();
        if (!$parent) {
            return response()->json(['message' => 'Profil parent non trouvé'], 404);
        }

        return DB::transaction(function () use ($request, $parent) {
            // 1. Update parent info
            $parent->update([
                'profession' => $request->parentProfession,
                'adresse' => $request->parentAddress,
                'telephone' => $request->parentPhone,
            ]);

            // 2. Split child name
            $names = explode(' ', $request->childName, 2);
            $prenom = $names[0];
            $nom = isset($names[1]) ? $names[1] : '---';

            // 3. Create User for child (No change here)
            // ... (keep logic as is)
            $childUsername = strtolower($prenom . '.' . $nom . '.' . rand(100, 999));
            $childUser = User::create([
                'nom' => $nom,
                'prenom' => $prenom,
                'username' => $childUsername,
                'email' => $childUsername . '@schoolhub.com',
                'password_hash' => 'password123',
                'role' => 'ELEVE',
            ]);

            // 4. Find appropriate Class matching the grade
            $classe = Classe::where('nom', 'LIKE', '%' . $request->childGrade . '%')->first();
            if (!$classe) {
                $classe = Classe::first();
                if (!$classe) {
                    $niveau = \App\Models\NiveauScolaire::firstOrCreate(
                        ['nom' => 'Général'],
                        ['description' => 'Niveau par défaut']
                    );
                    $classe = Classe::create([
                        'nom' => $request->childGrade, 
                        'niveau_id' => $niveau->id,
                        'annee_scolaire' => date('Y') . '-' . (date('Y') + 1)
                    ]);
                }
            }

            // 5. Create Eleve
            $series = \App\Models\Series::first();
            if (!$series) {
                $series = \App\Models\Series::create(['nom' => 'Général', 'code' => 'GEN']);
            }

            $eleve = Eleve::create([
                'user_id' => $childUser->id,
                'classe_id' => $classe->id,
                'serie_id' => $series->id,
                'sexe' => $request->childGender === 'Masculin' ? 'M' : 'F',
                'age' => \Carbon\Carbon::parse($request->childBirthDate)->age,
            ]);

            // 6. Link to parent
            $parent->eleves()->attach($eleve->id, ['relation_type' => 'PARENT']);

            // 7. Create Inscription
            $anneeScolaire = AnneeScolaire::orderBy('date_debut', 'desc')->first();
            if (!$anneeScolaire) {
                $anneeScolaire = AnneeScolaire::create([
                    'annee' => date('Y') . '-' . (date('Y') + 1),
                    'date_debut' => date('Y') . '-09-01',
                    'date_fin' => (date('Y') + 1) . '-07-31',
                ]);
            }

            Inscription::create([
                'eleve_id' => $eleve->id,
                'annee_scolaire_id' => $anneeScolaire->id,
                'date_inscription' => now(),
                'statut' => 'inscrit',
            ]);

            // 8. Payment Block Removed

            return response()->json([
                'message' => 'Inscription de l\'enfant réussie.',
                'eleve' => $eleve->load(['user', 'classe'])
            ], 201);
        });
    }

    /**
     * Get parent profile details.
     */
    public function getProfile()
    {
        $user = Auth::user();
        $parent = ParentTuteur::where('user_id', $user->id)->first();

        return response()->json([
            'user' => $user,
            'parent' => $parent
        ]);
    }

    /**
     * Update parent profile details.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $parent = ParentTuteur::where('user_id', $user->id)->first();

        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string',
            'profession' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $user, $parent) {
            $user->update([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
            ]);

            if ($parent) {
                $parent->update([
                    'nom' => $request->nom,
                    'prenom' => $request->prenom,
                    'email' => $request->email,
                    'telephone' => $request->telephone,
                    'profession' => $request->profession,
                ]);
            }
        });

        return response()->json(['message' => 'Profil mis à jour avec succès', 'user' => $user->fresh(), 'parent' => $parent->fresh()]);
    }

    /**
     * Update password.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password_hash)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 422);
        }

        $user->update([
            'password_hash' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

    /**
     * Update child photo.
     */
    public function updateChildPhoto(Request $request, $eleveId)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = Auth::user();
        $parent = ParentTuteur::where('user_id', $user->id)->first();

        // Check if the student belongs to the parent
        $isChild = $parent->eleves()->where('eleves.id', $eleveId)->exists();
        if (!$isChild) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $eleve = Eleve::findOrFail($eleveId);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = 'child_' . $eleveId . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/students'), $filename);
            
            $eleve->update([
                'photo' => 'uploads/students/' . $filename
            ]);

            return response()->json([
                'message' => 'Photo mise à jour avec succès',
                'photo_url' => asset('uploads/students/' . $filename)
            ]);
        }

        return response()->json(['message' => 'Erreur lors de l\'upload'], 400);
    }
}
