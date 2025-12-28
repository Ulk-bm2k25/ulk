<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffectationClasse extends Model
{
    use HasFactory;

    protected $table = 'affectations_classes';

    protected $fillable = [
        'eleve_id',
        'classe_id',
        'date_affectation',
        'statut',
        'commentaire',
    ];

    protected $casts = [
        'date_affectation' => 'date',
    ];

    /**
     * Relation: Une affectation appartient à un élève
     */
    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class, 'eleve_id');
    }

    /**
     * Relation: Une affectation appartient à une classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }
}

