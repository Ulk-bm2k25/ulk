<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\InscriptionController;
use Illuminate\Http\Request;

// Bootstrap Laravel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Simulate Admin Login
$admin = User::where('email', 'admin@example.com')->first();
if (!$admin) {
    echo "Admin user not found!\n";
    exit(1);
}

Auth::login($admin);
echo "Logged in as: " . $admin->email . " (Role: " . $admin->role . ")\n";

// Call Controller Method
$controller = new InscriptionController();
$response = $controller->index();

echo "Response Status: " . $response->status() . "\n";
$content = $response->getContent();
echo "Response Content: \n" . substr($content, 0, 1000) . "...\n"; // Truncate for readability
