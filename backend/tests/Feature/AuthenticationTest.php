<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ParentTuteur;
use Illuminate\Support\Facades\Hash;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test d'inscription parent réussie
     */
    public function test_parent_can_register_successfully(): void
    {
        $response = $this->postJson('/api/auth/register/parent', [
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@example.com',
            'password' => 'Test@123456',
            'password_confirmation' => 'Test@123456',
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'telephone' => '+22997123456',
            'adresse' => 'Cotonou',
            'profession' => 'Ingénieur',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'role'],
                    'profile',
                    'token',
                    'token_type',
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'email' => 'jean.dupont@example.com',
                        'role' => 'parent',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'jean.dupont@example.com',
        ]);

        $this->assertDatabaseHas('parents_tuteurs', [
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'telephone' => '+22997123456',
        ]);
    }

    /**
     * Test d'inscription avec email déjà utilisé
     */
    public function test_registration_fails_with_duplicate_email(): void
    {
        User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->postJson('/api/auth/register/parent', [
            'name' => 'Test User',
            'email' => 'existing@example.com',
            'password' => 'Test@123456',
            'password_confirmation' => 'Test@123456',
            'nom' => 'User',
            'prenom' => 'Test',
            'telephone' => '+22997123456',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test d'inscription avec mot de passe faible
     */
    public function test_registration_fails_with_weak_password(): void
    {
        $response = $this->postJson('/api/auth/register/parent', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'weak',
            'password_confirmation' => 'weak',
            'nom' => 'User',
            'prenom' => 'Test',
            'telephone' => '+22997123456',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test de connexion réussie
     */
    public function test_user_can_login_successfully(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('Test@123456'),
            'email_verified_at' => now(),
        ]);

        ParentTuteur::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Test@123456',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user',
                    'profile',
                    'token',
                    'token_type',
                ]
            ])
            ->assertJson([
                'success' => true,
            ]);
    }

    /**
     * Test de connexion avec mauvais credentials
     */
    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('Test@123456'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect',
            ]);
    }

    /**
     * Test de connexion avec email non vérifié
     */
    public function test_login_fails_with_unverified_email(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('Test@123456'),
            'email_verified_at' => null,
        ]);

        ParentTuteur::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Test@123456',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'email_verified' => false,
            ]);
    }

    /**
     * Test de déconnexion
     */
    public function test_user_can_logout(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Déconnexion réussie',
            ]);
    }

    /**
     * Test de récupération des informations utilisateur
     */
    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        ParentTuteur::factory()->create([
            'user_id' => $user->id,
        ]);

        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => ['id', 'name', 'email', 'role'],
                    'profile',
                ]
            ]);
    }

    /**
     * Test d'accès non autorisé sans token
     */
    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401);
    }
}