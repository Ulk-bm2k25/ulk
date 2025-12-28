<?php

namespace App\Http\Controllers;

use App\Models\Inscription;
use App\Models\Eleve;
use App\Models\User;
use App\Models\ParentTuteur;
use App\Models\AnneeScolaire;
use App\Models\DocumentEleve;
use App\Models\Series;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InscriptionController extends Controller
{
    /**
     * Inscription complète : Parent + Élève avec documents
     */
    public function completeInscription(Request $request)
    {
        $validator = $request->validate([
            // Données parent
            'parent_nom' => 'required|string',
            'parent_prenom' => 'required|string',
            'parent_email' => 'required|email|unique:users,email',
            'parent_username' => 'required|string|unique:users,username',
            'parent_password' => 'required|min:8|confirmed',
            'parent_telephone' => 'required|string',
            'parent_adresse' => 'nullable|string',
            'parent_profession' => 'nullable|string',
            
            // Données élève
            'eleve_nom' => 'required|string',
            'eleve_prenom' => 'required|string',
            'eleve_date_naissance' => 'required|date',
            'eleve_lieu_naissance' => 'nullable|string',
            'eleve_sexe' => 'required|in:M,F',
            'eleve_adresse' => 'nullable|string',
            'eleve_serie_id' => 'nullable|exists:series,id',
            
            // Documents
            'eleve_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'documents' => 'nullable|array',
            'documents.*.type' => 'required|string',
            'documents.*.file' => 'required|file|mimes:pdf,jpeg,png,jpg|max:5120',
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Créer le compte utilisateur parent
            $parentUser = User::create([
                'nom' => $request->parent_nom,
                'prenom' => $request->parent_prenom,
                'username' => $request->parent_username,
                'email' => $request->parent_email,
                'password_hash' => Hash::make($request->parent_password),
                'role' => 'PARENT',
            ]);

            // 2. Créer le profil parent/tuteur
            $parent = ParentTuteur::create([
                'user_id' => $parentUser->id,
                'nom' => $request->parent_nom,
                'prenom' => $request->parent_prenom,
                'telephone' => $request->parent_telephone,
                'email' => $request->parent_email,
                'adresse' => $request->parent_adresse,
                'profession' => $request->parent_profession,
            ]);

            // 3. Générer un matricule unique pour l'élève
            $matricule = $this->generateMatricule();

            // 4. Créer le compte utilisateur élève
            $eleveUsername = strtolower($request->eleve_prenom . '.' . $request->eleve_nom . '.' . rand(100, 999));
            $eleveUser = User::create([
                'nom' => $request->eleve_nom,
                'prenom' => $request->eleve_prenom,
                'username' => $eleveUsername,
                'email' => $eleveUsername . '@schoolhub.local',
                'password_hash' => Hash::make(Str::random(16)), // Mot de passe aléatoire
                'role' => 'ELEVE',
            ]);

            // 5. Upload de la photo de l'élève
            $photoPath = null;
            if ($request->hasFile('eleve_photo')) {
                $photo = $request->file('eleve_photo');
                $photoName = 'eleve_' . $eleveUser->id . '_' . time() . '.' . $photo->getClientOriginalExtension();
                $photoPath = $photo->storeAs('public/eleves/photos', $photoName);
                $photoPath = str_replace('public/', '', $photoPath);
            }

            // 6. Calculer l'âge
            $age = \Carbon\Carbon::parse($request->eleve_date_naissance)->age;

            // 7. Créer le profil élève
            $eleve = Eleve::create([
                'user_id' => $eleveUser->id,
                'serie_id' => $request->eleve_serie_id,
                'matricule' => $matricule,
                'sexe' => $request->eleve_sexe,
                'date_naissance' => $request->eleve_date_naissance,
                'lieu_naissance' => $request->eleve_lieu_naissance,
                'adresse' => $request->eleve_adresse,
                'photo' => $photoPath,
                'age' => $age,
            ]);

            // 8. Lier l'élève au parent
            $parent->eleves()->attach($eleve->id, [
                'relation_type' => 'PARENT',
                'est_responsable_legal' => true,
                'contact_urgence' => true,
            ]);

            // 9. Upload des documents
            if ($request->has('documents') && is_array($request->documents)) {
                foreach ($request->documents as $doc) {
                    if (isset($doc['file']) && $doc['file']->isValid()) {
                        $file = $doc['file'];
                        $fileName = 'doc_' . $eleve->id . '_' . $doc['type'] . '_' . time() . '.' . $file->getClientOriginalExtension();
                        $filePath = $file->storeAs('public/eleves/documents', $fileName);
                        $filePath = str_replace('public/', '', $filePath);

                        DocumentEleve::create([
                            'eleve_id' => $eleve->id,
                            'type' => $doc['type'],
                            'chemin_fichier' => $filePath,
                            'nom_original' => $file->getClientOriginalName(),
                            'date_upload' => now(),
                        ]);
                    }
                }
            }

            // 10. Créer l'inscription pour l'année scolaire active
            $anneeScolaire = AnneeScolaire::where('est_actif', true)->first();
            if (!$anneeScolaire) {
                $anneeScolaire = AnneeScolaire::orderBy('annee', 'desc')->first();
            }

            if (!$anneeScolaire) {
                // Créer une année scolaire par défaut
                $year = date('Y');
                $anneeScolaire = AnneeScolaire::create([
                    'annee' => $year . '-' . ($year + 1),
                    'date_debut' => $year . '-09-01',
                    'date_fin' => ($year + 1) . '-07-31',
                    'est_actif' => true,
                ]);
            }

            $inscription = Inscription::create([
                'eleve_id' => $eleve->id,
                'annee_scolaire_id' => $anneeScolaire->id,
                'date_inscription' => now(),
                'statut' => 'en attente',
            ]);

            // 11. Créer un token pour le parent
            $token = $parentUser->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Inscription complète réussie',
                'parent' => $parentUser,
                'eleve' => $eleve->load(['user', 'tuteurs']),
                'inscription' => $inscription->load(['anneeScolaire']),
                'token' => $token,
                'token_type' => 'Bearer',
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
        } while (Eleve::where('matricule', $matricule)->exists());

        return $matricule;
    }

    /**
     * Obtenir les documents d'un élève
     */
    public function getEleveDocuments($eleveId)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE', 'PARENT'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        // Si c'est un parent, vérifier que l'élève lui appartient
        if ($user->role === 'PARENT') {
            $parent = ParentTuteur::where('user_id', $user->id)->first();
            if (!$parent || !$parent->eleves()->where('eleves.id', $eleveId)->exists()) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
        }

        $documents = DocumentEleve::where('eleve_id', $eleveId)->get();

        return response()->json(['documents' => $documents]);
    }

    /**
     * Ajouter un document à un élève
     */
    public function addDocument(Request $request, $eleveId)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE', 'PARENT'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $request->validate([
            'type' => 'required|string',
            'file' => 'required|file|mimes:pdf,jpeg,png,jpg|max:5120',
        ]);

        $eleve = Eleve::findOrFail($eleveId);

        // Si c'est un parent, vérifier que l'élève lui appartient
        if ($user->role === 'PARENT') {
            $parent = ParentTuteur::where('user_id', $user->id)->first();
            if (!$parent || !$parent->eleves()->where('eleves.id', $eleveId)->exists()) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
        }

        $file = $request->file('file');
        $fileName = 'doc_' . $eleve->id . '_' . $request->type . '_' . time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('public/eleves/documents', $fileName);
        $filePath = str_replace('public/', '', $filePath);

        $document = DocumentEleve::create([
            'eleve_id' => $eleve->id,
            'type' => $request->type,
            'chemin_fichier' => $filePath,
            'nom_original' => $file->getClientOriginalName(),
            'date_upload' => now(),
        ]);

        return response()->json([
            'message' => 'Document ajouté avec succès',
            'document' => $document
        ], 201);
    }

    /**
     * Obtenir les détails d'une inscription
     */
    public function show($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $inscription = Inscription::with([
            'eleve.user',
            'eleve.classe.niveauScolaire',
            'eleve.tuteurs.user',
            'eleve.documents',
            'anneeScolaire'
        ])->findOrFail($id);

        return response()->json(['inscription' => $inscription]);
    }
    /**
     * List all inscriptions for admin.
     */
    public function index()
    {
        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $inscriptions = Inscription::with([
            'eleve.user',
            'eleve.classe',
            'eleve.tuteurs',
            'anneeScolaire'
        ])->orderBy('created_at', 'desc')->get();

        return response()->json(['inscriptions' => $inscriptions]);
    }

    /**
     * Update inscription status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|string|in:inscrit,rejete,en attente',
            'classe_id' => 'nullable|exists:classes,id',
            'classe_souhaitee' => 'nullable|string', // Pour créer une nouvelle classe
            'niveau_id' => 'nullable|exists:niveaux_scolaires,id', // Pour créer une nouvelle classe
        ]);

        $user = Auth::user();
        if (!in_array($user->role, ['ADMIN', 'RESPONSABLE'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $inscription = Inscription::findOrFail($id);
        
        return DB::transaction(function () use ($request, $inscription, $user) {
            $eleve = $inscription->eleve;
            $anneeScolaire = $inscription->anneeScolaire;
            $anneeScolaireStr = $anneeScolaire ? $anneeScolaire->annee : date('Y') . '-' . (date('Y') + 1);

            // Si l'inscription est validée
            if ($request->statut === 'inscrit') {
                $classe = null;

                // Si une classe_id est fournie, l'utiliser
                if ($request->has('classe_id') && $request->classe_id) {
                    $classe = Classe::find($request->classe_id);
                }
                // Sinon, chercher une classe correspondant à la classe souhaitée
                elseif ($request->has('classe_souhaitee') && $request->classe_souhaitee) {
                    $classe = Classe::where('nom', 'LIKE', '%' . $request->classe_souhaitee . '%')
                        ->where('annee_scolaire', $anneeScolaireStr)
                        ->first();

                    // Si aucune classe trouvée, créer une nouvelle classe
                    if (!$classe && $request->has('niveau_id')) {
                        $niveau = \App\Models\NiveauScolaire::find($request->niveau_id);
                        if ($niveau) {
                            $classe = Classe::create([
                                'nom' => $request->classe_souhaitee,
                                'niveau_id' => $niveau->id,
                                'annee_scolaire' => $anneeScolaireStr,
                                'capacity_max' => 30,
                                'current_students' => 0,
                            ]);
                        }
                    }
                }

                // Si toujours pas de classe, chercher dans le commentaire de l'inscription
                if (!$classe && $inscription->commentaire) {
                    // Extraire la classe souhaitée du commentaire
                    if (preg_match('/Classe souhaitée: (.+?)(?: -|$)/', $inscription->commentaire, $matches)) {
                        $classeSouhaitee = trim($matches[1]);
                        $classe = Classe::where('nom', 'LIKE', '%' . $classeSouhaitee . '%')
                            ->where('annee_scolaire', $anneeScolaireStr)
                            ->first();
                    }
                }

                // Si une classe est trouvée/créée, affecter l'élève
                if ($classe) {
                    // Vérifier la capacité
                    if ($classe->isFull()) {
                        return response()->json([
                            'message' => 'La classe est pleine. Capacité maximale: ' . $classe->capacity_max
                        ], 400);
                    }

                    // Affecter l'élève à la classe
                    $eleve->update(['classe_id' => $classe->id]);
                    $classe->incrementStudents();

                    // Créer l'affectation
                    \App\Models\AffectationClasse::create([
                        'eleve_id' => $eleve->id,
                        'classe_id' => $classe->id,
                        'date_affectation' => now(),
                        'statut' => 'affecte',
                    ]);
                } else {
                    // Si aucune classe n'est trouvée, retourner une erreur
                    return response()->json([
                        'message' => 'Aucune classe correspondante trouvée. Veuillez créer une classe ou en sélectionner une.',
                        'requires_class_creation' => true,
                        'classe_souhaitee' => $request->classe_souhaitee ?? 'N/A',
                    ], 400);
                }
            }

            $inscription->update(['statut' => $request->statut]);

            // Create notification for the parent(s)
            $eleve = $inscription->eleve;
            $tuteurs = $eleve->tuteurs;

            foreach ($tuteurs as $tuteur) {
                if ($tuteur->user_id) {
                    DB::table('notifications')->insert([
                        'type' => $request->statut === 'inscrit' ? 'success' : 'alert',
                        'message' => "L'inscription de " . ($eleve->user->prenom ?? '') . " " . ($eleve->user->nom ?? '') . " a été " . ($request->statut === 'inscrit' ? 'validée' : 'rejetée') . ".",
                        'destinataire_id' => $tuteur->user_id,
                        'lu' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Log activity
            DB::table('logs_activite')->insert([
                'user_id' => $user->id,
                'action' => "Mise à jour statut inscription ID $inscription->id vers $request->statut",
                'created_at' => now(), // Was date_action
                'updated_at' => now(), // Add updated_at
                'ip_address' => $request->ip(), // Was ip_adresse
            ]);

            return response()->json([
                'message' => 'Statut mis à jour avec succès',
                'inscription' => $inscription->load(['eleve.user', 'eleve.classe'])
            ]);
        });
    }
}
