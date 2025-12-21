<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test d'envoi du lien de réinitialisation
     */
    public function test_user_can_request_password_reset_link(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test d'envoi avec email inexistant
     */
    public function test_password_reset_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test de réinitialisation du mot de passe
     */
    public function test_user_can_reset_password_with_valid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        // Générer un token
        $token = Password::createToken($user);

        $response = $this->postJson('/api/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'NewP@ss123!',
            'password_confirmation' => 'NewP@ss123!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Vérifier que le mot de passe a changé
        $user->refresh();
        $this->assertTrue(Hash::check('NewP@ss123!', $user->password));
    }

    /**
     * Test de réinitialisation avec token invalide
     */
    public function test_password_reset_fails_with_invalid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson('/api/auth/reset-password', [
            'token' => 'invalid-token',
            'email' => 'test@example.com',
            'password' => 'NewP@ss123!',
            'password_confirmation' => 'NewP@ss123!',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Test de vérification de token valide
     */
    public function test_can_verify_valid_reset_token(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/auth/verify-reset-token', [
            'token' => $token,
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'valid' => true,
            ]);
    }

    /**
     * Test de vérification de token invalide
     */
    public function test_verify_fails_with_invalid_token(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson('/api/auth/verify-reset-token', [
            'token' => 'invalid-token',
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'valid' => false,
            ]);
    }
}