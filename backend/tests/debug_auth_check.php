<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Models\ParentTuteur;
use Illuminate\Support\Facades\DB;

// Delete existing test user if exists
$email = 'debug_test@example.com';
$password = 'password123';
User::where('email', $email)->delete();

echo "Creating user with email: $email\n";

try {
    DB::transaction(function () use ($email, $password) {
        $user = User::create([
            'nom' => 'Debug',
            'prenom' => 'User',
            'username' => 'debug_user',
            'email' => $email,
            'password_hash' => Hash::make($password),
            'role' => 'PARENT',
        ]);

        echo "User created. ID: " . $user->id . "\n";
        echo "Stored password_hash: " . $user->password_hash . "\n";

        // Check if hashed
        $info = Hash::info($user->password_hash);
        echo "Hash info: " . json_encode($info) . "\n";

        if ($info['algoName'] === 'unknown') {
            echo "ERROR: Password is NOT hashed!\n";
        } else {
            echo "SUCCESS: Password is hashed.\n";
        }
        
        // Create ParentTuteur
        echo "Creating ParentTuteur...\n";
        ParentTuteur::create([
            'user_id' => $user->id,
            'nom' => 'Debug',
            'prenom' => 'User',
            'telephone' => '123456789',
            'email' => $email,
        ]);
        echo "ParentTuteur created successfully.\n";

        // Attempt login
        echo "Attempting Auth::attempt...\n";
        $credentials = ['email' => $email, 'password' => $password];
        
        if (Auth::attempt($credentials)) {
            echo "SUCCESS: Auth::attempt returned true.\n";
        } else {
            echo "FAILURE: Auth::attempt returned false.\n";
        }
    });

} catch (\Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
