<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NiveauScolaire extends Model
{
    use HasFactory;

    protected $table = 'niveaux_scolaires';

    protected $fillable = [
        'nom',
        'description',
    ];

    /**
     * Relation: un niveau peut avoir plusieurs classes
     */
    public function classes(): HasMany
    {
        return $this->hasMany(Classe::class, 'niveau_id');
    }

    /**
     * Relation: un niveau peut avoir plusieurs cycles
     */
    public function cycles(): HasMany
    {
        return $this->hasMany(Cycle::class, 'niveau_id');
    }
}
