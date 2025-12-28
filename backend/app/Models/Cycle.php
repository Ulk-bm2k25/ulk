<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cycle extends Model
{
    protected $table = 'cycles';

    protected $fillable = [
        'nom',
        'niveau_id',
        'description',
    ];

    /**
     * Relation: Un cycle appartient à un niveau scolaire
     */
    public function niveauScolaire(): BelongsTo
    {
        return $this->belongsTo(NiveauScolaire::class, 'niveau_id');
    }
}
