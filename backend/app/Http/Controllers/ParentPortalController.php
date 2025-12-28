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
            'parentEmail' => 'nullable|email',
            'parentProfession' => 'nullable|string',
            'parentAddress' => 'nullable|string',
            'childName' => 'required|string',
            'childBirthDate' => 'required|date',
            'childGender' => 'required|string',
            'childGrade' => 'required|string',
            'childPhoto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'birthCertificate' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:5120',
        ]);

        $user = Auth::user();
        if ($user->role !== 'PARENT') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $parent = ParentTuteur::where('user_id', $user->id)->first();
        if (!$parent) {
            return response()->json(['message' => 'Profil parent non trouvé'], 404);
        }

        return DB::transaction(function () use ($request, $parent, $user) {
            // 1. Update parent info (récupérer depuis le parent connecté)
            $parent->update([
                'nom' => explode(' ', $request->parentName, 2)[1] ?? $parent->nom,
                'prenom' => explode(' ', $request->parentName, 2)[0] ?? $parent->prenom,
                'profession' => $request->parentProfession ?? $parent->profession,
                'adresse' => $request->parentAddress ?? $parent->adresse,
                'telephone' => $request->parentPhone ?? $parent->telephone,
                'email' => $request->parentEmail ?? $parent->email ?? $user->email,
            ]);

            // Mettre à jour aussi l'utilisateur
            $user->update([
                'nom' => explode(' ', $request->parentName, 2)[1] ?? $user->nom,
                'prenom' => explode(' ', $request->parentName, 2)[0] ?? $user->prenom,
                'email' => $request->parentEmail ?? $user->email,
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

            // 4. Find appropriate Class matching the grade (logique améliorée)
            $anneeScolaire = AnneeScolaire::where('est_actif', true)->first();
            if (!$anneeScolaire) {
                $anneeScolaire = AnneeScolaire::orderBy('date_debut', 'desc')->first();
            }
            $anneeScolaireStr = $anneeScolaire ? $anneeScolaire->annee : date('Y') . '-' . (date('Y') + 1);

            // Chercher une classe correspondante
            $classe = Classe::where('nom', 'LIKE', '%' . $request->childGrade . '%')
                ->where('annee_scolaire', $anneeScolaireStr)
                ->first();

            // Si aucune classe trouvée, retourner une erreur pour que l'admin puisse créer la classe
            if (!$classe) {
                // Créer l'inscription en attente sans classe
                // L'admin devra créer la classe et valider l'inscription
            }

            // 5. Upload photo de l'élève
            $photoPath = null;
            if ($request->hasFile('childPhoto')) {
                $photo = $request->file('childPhoto');
                $photoName = 'eleve_' . $childUser->id . '_' . time() . '.' . $photo->getClientOriginalExtension();
                $photoPath = $photo->storeAs('public/eleves/photos', $photoName);
                $photoPath = str_replace('public/', '', $photoPath);
            }

            // 6. Create Eleve
            $series = \App\Models\Series::first();
            if (!$series) {
                $series = \App\Models\Series::create(['nom' => 'Général', 'code' => 'GEN']);
            }

            // Générer matricule
            $matricule = $this->generateMatricule();

            $eleve = Eleve::create([
                'user_id' => $childUser->id,
                'classe_id' => $classe ? $classe->id : null,
                'serie_id' => $series->id,
                'matricule' => $matricule,
                'sexe' => $request->childGender === 'Masculin' ? 'M' : 'F',
                'date_naissance' => $request->childBirthDate,
                'age' => \Carbon\Carbon::parse($request->childBirthDate)->age,
                'photo' => $photoPath,
            ]);

            // 7. Upload documents
            if ($request->hasFile('birthCertificate')) {
                $doc = $request->file('birthCertificate');
                $docName = 'doc_' . $eleve->id . '_acte_naissance_' . time() . '.' . $doc->getClientOriginalExtension();
                $docPath = $doc->storeAs('public/eleves/documents', $docName);
                $docPath = str_replace('public/', '', $docPath);

                \App\Models\DocumentEleve::create([
                    'eleve_id' => $eleve->id,
                    'type' => 'acte_naissance',
                    'chemin_fichier' => $docPath,
                    'nom_original' => $doc->getClientOriginalName(),
                    'date_upload' => now(),
                ]);
            }

            // 8. Link to parent
            $parent->eleves()->attach($eleve->id, [
                'relation_type' => 'PARENT',
                'est_responsable_legal' => true,
                'contact_urgence' => true,
            ]);

            // 9. Create Inscription avec classe souhaitée
            if (!$anneeScolaire) {
                $anneeScolaire = AnneeScolaire::create([
                    'annee' => date('Y') . '-' . (date('Y') + 1),
                    'date_debut' => date('Y') . '-09-01',
                    'date_fin' => (date('Y') + 1) . '-07-31',
                    'est_actif' => true,
                ]);
            }

            $inscription = Inscription::create([
                'eleve_id' => $eleve->id,
                'annee_scolaire_id' => $anneeScolaire->id,
                'date_inscription' => now(),
                'statut' => 'en attente',
                'commentaire' => $classe ? null : "Classe souhaitée: {$request->childGrade} - À créer par l'administration",
            ]);

            return response()->json([
                'message' => $classe 
                    ? 'Inscription de l\'enfant réussie.' 
                    : 'Demande d\'inscription soumise. La classe sera créée lors de la validation.',
                'eleve' => $eleve->load(['user', 'classe']),
                'inscription' => $inscription,
                'classe_created' => $classe !== null,
                'classe_souhaitee' => $request->childGrade,
            ], 201);
        });
    }

    /**
     * Générer un matricule unique
     */
    private function generateMatricule()
    {
        $year = date('y');
        do {
            $number = str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
            $matricule = 'E' . $year . $number;
        } while (\App\Models\Eleve::where('matricule', $matricule)->exists());

        return $matricule;
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
