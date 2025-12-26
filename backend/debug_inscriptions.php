<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Inscription;
use App\Models\User;
use App\Models\Eleve;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

echo "--- DEBUG INSCRIPTIONS ---\n";
$count = Inscription::count();
echo "Total Inscriptions in DB: $count\n";

$inscriptions = Inscription::with(['eleve.user', 'eleve.classe'])->get();

foreach ($inscriptions as $insc) {
    echo "ID: " . $insc->id . " | Status: " . $insc->statut . "\n";
    if ($insc->eleve) {
        echo "  - Eleve ID: " . $insc->eleve->id . "\n";
        if ($insc->eleve->user) {
            echo "  - User: " . $insc->eleve->user->prenom . " " . $insc->eleve->user->nom . "\n";
        } else {
            echo "  - User: NULL\n";
        }
    } else {
        echo "  - Eleve: NULL\n";
    }
}
echo "--------------------------\n";
