<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarteScolarite extends Model
{
    protected $table = 'cartes_scolarite';

    protected $fillable = [
        'eleve_id',
        'annee_scolaire',
        'code_barre',
        'date_generation',
        'statut'
    ];

    protected $casts = [
        'date_generation' => 'date',
    ];

    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class, 'eleve_id');
    }
}