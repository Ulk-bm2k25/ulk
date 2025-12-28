<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cycle extends Model
{
    use HasFactory;

    protected $table = 'cycles';

    protected $fillable = [
        'nom',
        'niveau_id',
        'description',
    ];

    /**
     * Relation : un cycle appartient à un niveau scolaire.
     * On expose deux noms de méthode pour compatibilité : niveau() et niveauScolaire().
     */
    public function niveau(): BelongsTo
    {
        return $this->belongsTo(NiveauScolaire::class, 'niveau_id');
    }

    /**
     * Alias pour compatibilité avec l'autre branche.
     */
    public function niveauScolaire(): BelongsTo
    {
        return $this->niveau();
    }
}
