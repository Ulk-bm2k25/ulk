<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Matiere extends Model
{
    use HasFactory;

    /**
     * Le nom de la table dans la base de données
     */
    protected $table = 'matieres';

    /**
     * Les champs pouvant être assignés en masse
     */
    protected $fillable = [
        'nom',
        'coefficient',
    ];

    /**
     * Relation: une matière peut avoir plusieurs cours
     *
     * @return HasMany
     */
    public function cours(): HasMany
    {
        return $this->hasMany(Course::class, 'matiere_id');
    }
}
