<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
use App\Models\Inscription;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

$inscriptions = Inscription::all();
echo "COUNT:" . $inscriptions->count() . "\n";
foreach ($inscriptions as $i) {
    echo "ID:" . $i->id . ",STATUT:" . $i->statut . "\n";
}
