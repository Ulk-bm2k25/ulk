<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ParentTuteur>
 */
class ParentTuteurFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'telephone' => '+229' . fake()->numerify('########'),
            'email' => fake()->unique()->safeEmail(),
            'adresse' => fake()->address(),
            'profession' => fake()->jobTitle(),
        ];
    }
}