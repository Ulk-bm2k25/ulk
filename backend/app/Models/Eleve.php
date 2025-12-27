<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
     * Relation: Un élève a plusieurs présences
     */
    public function presences(): HasMany
    {
        return $this->hasMany(Presence::class, 'eleve_id');
    }

    /**
     * Relation: Un élève a plusieurs permissions
     */
    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class, 'eleve_id');
    }

    /**
     * Relation: Un élève appartient à une série
     */
    public function serie(): BelongsTo
    {
        return $this->belongsTo(Serie::class, 'serie_id');
    }

    /**
     * Helper: Obtenir le premier tuteur (utilisé comme alias dans certains contrôleurs)
     */
    public function getParentTuteurAttribute()
    {
        return $this->tuteurs->first();
    }
}