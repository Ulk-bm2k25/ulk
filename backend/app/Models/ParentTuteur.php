<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ParentTuteur extends Model
{
    use HasFactory;

    /**
     * Le nom de la table dans la base de données
     */
    protected $table = 'parents_tuteurs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'telephone',
        'email',
        'adresse',
        'profession',
    ];

    /**
     * Relation: Un parent appartient à un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relation: Un parent peut avoir plusieurs élèves
     */
    public function eleves(): BelongsToMany
    {
        return $this->belongsToMany(
            Eleve::class,
            'relations_eleve_tuteur',
            'tuteur_id',
            'eleve_id'
        )->withPivot('relation_type')
          ->withTimestamps();
    }

    /**
     * Obtenir le nom complet du parent
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->nom} {$this->prenom}";
    }
}