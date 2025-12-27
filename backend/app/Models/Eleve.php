<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Eleve extends Model
{
    use HasFactory;

    /**
     * Le nom de la table dans la base de données
     */
    protected $table = 'eleves';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'classe_id',
        'serie_id',
        'sexe',
        'age',
        'photo', // Added photo as well just in case for future
        'matricule' // Added matricule
    ];

    /**
     * Relation: Un élève appartient à un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relation: Un élève peut avoir plusieurs tuteurs
     */
    public function tuteurs(): BelongsToMany
    {
        return $this->belongsToMany(
            ParentTuteur::class,
            'relations_eleve_tuteur',
            'eleve_id',
            'tuteur_id'
        )->withPivot('relation_type')
          ->withTimestamps();
    }
    /**
     * Relation: Un élève appartient à une classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    /**
     * Relation: Un élève a plusieurs inscriptions
     */
    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}