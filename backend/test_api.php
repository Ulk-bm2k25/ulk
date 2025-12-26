<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Auth;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

// Login as admin
$admin = User::where('email', 'admin@example.com')->first();
if (!$admin) {
    echo "ERROR: Admin user not found\n";
    exit(1);
}

// Create token
$token = $admin->createToken('test')->plainTextToken;
echo "TOKEN: $token\n\n";

// Test API call
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/admin/inscriptions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP CODE: $httpCode\n";
echo "RESPONSE: " . substr($response, 0, 500) . "\n";

if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "\nINSCRIPTIONS COUNT: " . count($data['inscriptions'] ?? []) . "\n";
} else {
    echo "\nERROR: API call failed\n";
}
