<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Eleve;
use App\Models\Inscription;
use App\Models\ParentTuteur;
use Illuminate\Support\Facades\DB;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

echo "=== NETTOYAGE DES DONNÉES DE TEST ===\n\n";

// 1. Supprimer l'élève de test (Alice Smith)
echo "1. Suppression de l'élève de test...\n";
$testStudent = User::where('email', 'alice_test@example.com')->first();
if ($testStudent) {
    $eleve = Eleve::where('user_id', $testStudent->id)->first();
    if ($eleve) {
        // Supprimer les inscriptions
        Inscription::where('eleve_id', $eleve->id)->delete();
        echo "   - Inscriptions supprimées\n";
        
        // Supprimer l'élève
        $eleve->delete();
        echo "   - Élève supprimé\n";
    }
    
    // Supprimer l'utilisateur
    $testStudent->delete();
    echo "   - Utilisateur supprimé\n";
}

// 2. Garder le parent de test mais supprimer ses notifications de test
echo "\n2. Nettoyage des notifications de test...\n";
DB::table('notifications')->where('message', 'like', '%Nouvelle inscription confirmée%')->delete();
echo "   - Notifications de test supprimées\n";

// 3. Garder l'admin et le parent1 (credentials utiles)
echo "\n3. Conservation des comptes utiles:\n";
echo "   ✓ admin@example.com (RESPONSABLE)\n";
echo "   ✓ parent1@example.com (PARENT)\n";

// 4. Afficher le résumé
echo "\n=== RÉSUMÉ APRÈS NETTOYAGE ===\n";
$users = User::all();
foreach ($users as $user) {
    echo "- {$user->email} ({$user->role})\n";
}

$inscriptions = Inscription::with('eleve.user')->get();
echo "\nInscriptions restantes: " . $inscriptions->count() . "\n";
foreach ($inscriptions as $insc) {
    $name = $insc->eleve->user->prenom . ' ' . $insc->eleve->user->nom;
    echo "- $name (Statut: {$insc->statut})\n";
}

echo "\n✅ Nettoyage terminé !\n";
